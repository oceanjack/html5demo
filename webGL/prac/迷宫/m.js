var gl;
var aiSrc = "ai.js,ai.js,";
var music;
var walkBell;
var loadingtextT;
var showWorld = 0;
var showWorldText = "You don't kown where to go./Just walking around./Losted yourself in the darkness./The ring gives you hope,/But also it makes you despair...";
//初始化
function init() {
    music = document.createElement("audio");
    var musicSrc = document.createElement("source");
    var musicNum = Math.floor(Math.random() * 3 + 1);
    musicSrc.setAttribute("src", "0" + musicNum + ".ogg");
    musicSrc.setAttribute("type", "audio/ogg");
    musicSrc.setAttribute("loop", "loop");
    music.appendChild(musicSrc);
    music.play();

    walkBell = document.createElement("audio");
    musicSrc = document.createElement("source");
    musicSrc.setAttribute("src", "bell.ogg");
    musicSrc.setAttribute("type", "audio/ogg");
    musicSrc.setAttribute("loop", "loop");
    walkBell.appendChild(musicSrc);
}
//初始化GL
function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}
window.onresize = function () {
    initGL(document.getElementById("cs-canvas"));
}
//获得着色器
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

var shaderProgram;
//初始化着色器
function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
    shaderProgram.pointLightingColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingColor");
}
//处理载入纹理
function handleLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.bindTexture(gl.TEXTURE_2D, null);
}

var mudTexture;
//初始化纹理
function initTexture() {
    mudTexture = gl.createTexture();
    mudTexture.image = new Image();
    mudTexture.image.onload = function () {
        handleLoadedTexture(mudTexture)
    }
    mudTexture.image.src = "glass.gif";
}

var mvMatrix;
var mvMatrixStack = [];
var pMatrix;
//压栈
function mvPushMatrix() {
    var copy = new okMat4();
    mvMatrix.clone(copy);
    mvMatrixStack.push(copy);
}
//出栈
function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}
//推送显卡
function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix.toArray());
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix.toArray());

    var normalMatrix = mvMatrix.inverse().transpose();
    gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, normalMatrix.toArray());
}

var currentlyPressedKeys = {};
//记录键盘输入
function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}
function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

var pitch = 0;
var pitchRate = 0;

var yaw = 0;
var yawRate = 0;

var xPos = 0;
var yPos = 0.4;
var zPos = 0;

var speed = 0;
//处理键盘输入
function handleKeys() {
    if (currentlyPressedKeys[33]) {
        //Page Up
        pitchRate = 0.1;
    } else if (currentlyPressedKeys[34]) {
        //Page Down
        pitchRate = -0.1;
    } else {
        pitchRate = 0;
    }
    if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
        //Left or A
        yawRate = 0.1;
    } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
        //Right or D
        yawRate = -0.1;
    } else {
        yawRate = 0;
    }
    if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
        //Up or W
        speed = 0.003;
    } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
        //Down key
        speed = -0.003;
    } else {
        speed = 0;
        walkBell.play();
    }
}

var worldVertexPositionBuffer = null;
var worldVertexTextureCoordBuffer = null;
var worldVertexNormalBuffer = null;
var mapMatrix = [];
var dark = 1.0;
//处理光照
function handleLight() {
    //环境光
    gl.uniform3f(shaderProgram.ambientColorUniform, 0.01, 0.01, 0.01);

    if (zPos >= 0)
        dark = (60 - zPos) / 60.0;
    else
        dark = 1.0;
    gl.uniform3f(shaderProgram.pointLightingLocationUniform, 0.0, 0.60 * dark, 0.0);
    gl.uniform3f(shaderProgram.pointLightingColorUniform, 0.9, 0.9, 0.9);
}
//处理world
function handleLoadedWorld(data) {
    var lines = data.split("\n");
    var vertexCount = 0;
    var vertexPositions = [];
    var vertexTextureCoords = [];
    var tempVals = null;
    for (var i in lines) {
        var vals = lines[i].replace(/^\s+/, "").split(/\s+/);
        if (vals.length == 5 && vals[0] != "//") {
            //x,y,z
            vertexPositions.push(parseFloat(vals[0]));
            vertexPositions.push(parseFloat(vals[1]));
            vertexPositions.push(parseFloat(vals[2]));

            //纹理
            vertexTextureCoords.push(parseFloat(vals[3]));
            vertexTextureCoords.push(parseFloat(vals[4]));

            vertexCount += 1;

            if (vertexCount > 1 && tempVals != null && (vertexCount - 1) % 6 != 0) {
                var newTempX = parseInt(vals[0]);
                var newTempZ = parseInt(vals[2]);
                var oldTempX = parseInt(tempVals[0]);
                var oldTempZ = parseInt(tempVals[2]);
                mapMatrix.push(newTempX);
                mapMatrix.push(newTempZ);
                mapMatrix.push(oldTempX);
                mapMatrix.push(oldTempZ);
            }
            tempVals = vals;
        }
    }

    worldVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
    worldVertexPositionBuffer.itemSize = 3;
    worldVertexPositionBuffer.numItems = vertexCount;

    worldVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);
    worldVertexTextureCoordBuffer.itemSize = 2;
    worldVertexTextureCoordBuffer.numItems = vertexCount;

    worldVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexNormalBuffer);
    var verexNormals = [];
    for (var i = 0; i < vertexCount; ++i) {
        verexNormals.push(0.0);
        verexNormals.push(1.0);
        verexNormals.push(0.0);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verexNormals), gl.STATIC_DRAW);
    worldVertexNormalBuffer.itemSize = 3;
    worldVertexNormalBuffer.numItems = vertexCount;

    document.getElementById("loadingtext").textContent = "";
    loadingtextT = 100000;
}
//加载world
function loadWorld() {
    var request = new XMLHttpRequest();
    request.open("GET", "world.txt");
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            handleLoadedWorld(request.responseText);
        }
    }
    request.send();
}
//渲染
function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (worldVertexTextureCoordBuffer == null || worldVertexPositionBuffer == null) {
        return;
    }

    pMatrix = okMat4Proj(35, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

    mvMatrix = new okMat4();
    mvMatrix.rotX(OAK.SPACE_LOCAL, -pitch, true);
    mvMatrix.rotY(OAK.SPACE_LOCAL, -yaw, true);
    mvMatrix.translate(OAK.SPACE_LOCAL, -xPos, -yPos, -zPos, true);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, mudTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, worldVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, worldVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, worldVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    handleLight();

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, worldVertexPositionBuffer.numItems);

    printText();
}
//文字提示
function showWorldTextf() {
    if (showWorld >= showWorldText.length)
        return;
    if (loadingtextT % 10 == 0) {
        var cont = document.getElementById("loadingtext").textContent;
        if (showWorldText[showWorld] == '/')
            document.getElementById("loadingtext").textContent = cont + "\n";
        else
            document.getElementById("loadingtext").textContent = cont + showWorldText[showWorld];
        ++showWorld;
    }
    if (showWorld >= showWorldText.length) {
        cont = "";
        loadingtextT = 50;
    }

}
//输出文字
function printText() {
    showWorldTextf();
    if (loadingtextT > 0)
        document.getElementById("loadingtext").style.display = "block";
    else
        document.getElementById("loadingtext").style.display = "none";
}
//角度转弧度
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
function radTodeg(rad) {
    return rad * 180 / Math.PI;
}
//终点镜像轮回
function endMirror() {
    while (yaw < 0)
        yaw += 360;
    while (yaw >= 360)
        yaw -= 360;
    if (xPos <= -59.0 && zPos <= -59.7 && (0 < yaw < 90 || 270 < yaw < 360)) {
        loadingtextT = 100;
        document.getElementById("loadingtext").textContent = "A new World.";
        xPos = Math.floor(Math.random() * 100 - 50) + 0.5;
        zPos = Math.floor(Math.random() * 100 - 50) + 0.5;
        //yaw = 180 - yaw;
    }
}
//穿越检测(根据地图特性降维处理线段即可)
var isxWall = false;
var isyWall = false;
function canBeCross(ox, oy, nx, ny) {
    var mapLength = mapMatrix.length;
    for (var i = 0 ; i < mapLength; i += 4) {
        var x0 = mapMatrix[i];
        var y0 = mapMatrix[i + 1];
        var x1 = mapMatrix[i + 2];
        var y1 = mapMatrix[i + 3];
        if (x0 == x1 && y0 == y1) {
            if ((nx - x0) * (nx - x0) + (ny - y0) * (ny - y0) < 0.01) {
                isxWall = true;
                isyWall = true;
            }
        }
        if (x0 == x1) {
            if (y0 < y1 && y0 - 0.01 <= oy && oy <= y1 + 0.01 && y0 - 0.01 <= ny && ny <= y1 + 0.01) {
                y0 -= 0.1;
                y1 += 0.1;
                var ciAO = nx - x0;
                var niMa = ox - x0;
                if ((ciAO > 0 && niMa < 0) || (ciAO < 0 && niMa > 0) || Math.abs(ciAO) < 0.12)
                    isxWall = true;
            }
            if (y1 < y0 && y1 - 0.01 <= oy && oy <= y0 + 0.01 && y1 - 0.01 <= ny && ny <= y0 + 0.01) {
                y0 += 0.1;
                y1 -= 0.1;
                var ciAO = nx - x0;
                var niMa = ox - x0;
                if ((ciAO > 0 && niMa < 0) || (ciAO < 0 && niMa > 0) || Math.abs(ciAO) < 0.12)
                    isxWall = true;
            }
        }
        if (y0 == y1) {
            if (x0 < x1 && x0 - 0.01 <= ox && ox <= x1 + 0.01 && x0 - 0.01 <= nx && nx <= x1 + 0.01) {
                x0 -= 0.1;
                x1 += 0.1;
                var ciAO = ny - y0;
                var niMa = oy - y0;
                if ((ciAO > 0 && niMa < 0) || (ciAO < 0 && niMa > 0) || Math.abs(ciAO) < 0.12)
                    isyWall = true;
            }
            if (x1 < x0 && x1 - 0.01 <= ox && ox <= x0 + 0.01 && x1 - 0.01 <= nx && nx <= x0 + 0.01) {
                x0 += 0.1;
                x1 -= 0.1;
                var ciAO = ny - y0;
                var niMa = oy - y0;
                if ((ciAO > 0 && niMa < 0) || (ciAO < 0 && niMa > 0) || Math.abs(ciAO) < 0.12)
                    isyWall = true;
            }
        }
    }
    return true;
}

var lastTime = 0;
//上下晃动
var joggingAngle = 0;
//时钟变化
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        --loadingtextT;
        if (loadingtextT < 0)
            loadingtextT = 0;
        if (speed != 0) {
            var tempxPos = xPos - Math.sin(degToRad(yaw)) * speed * elapsed;
            var tempzPos = zPos - Math.cos(degToRad(yaw)) * speed * elapsed;
            isxWall = false;
            isyWall = false;
            canBeCross(xPos, zPos, tempxPos, tempzPos);
            if (isxWall == false)
                xPos = tempxPos;
            if (isyWall == false)
                zPos = tempzPos;

            joggingAngle += elapsed * 0.6;
            yPos = Math.sin(degToRad(joggingAngle)) / 20 + 0.4
        }

        yaw += yawRate * elapsed;
        endMirror();
        if (-30 < pitch + pitchRate * elapsed && pitch + pitchRate * elapsed < 70)
            pitch += pitchRate * elapsed;
    }
    lastTime = timeNow;
}
//循环处理
function tick() {
    handleKeys();
    drawScene();
    handleAI();
}
//相当于Main函数
function webGLStart() {
    var canvas = document.getElementById("cs-canvas");
    init();
    initGL(canvas);
    initShaders();
    initTexture();
    loadWorld();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    tick();
}
//传入数据
function handleAI() {
    if (1 || mySrc == null)
    {
        animate();
        okRequestAnimationFrame(tick);
        return;
    }
    platform_ai_js_exec.executeMultipleProcess(
        mySrc,
        { 'type': 'mes', 'xPos': xPos, 'zPos': zPos, 't': lastTime, 'yaw': yaw, 'mapMatrix': mapMatrix },
        function (evt) {
            if (evt == null || evt == '') {
                animate();
                okRequestAnimationFrame(tick);
                return;
            }
            //alert(evt.myOrder);
            switch (evt.type) {
                case ('order'):
                    switch (evt.myOrder) {
                        case 0:
                            yawRate = 0.1;
                            break;
                        case 1:
                            yawRate = -0.1;
                            break;
                        case 2:
                            speed = 0.003;
                            break;
                        case 3:
                            speed = -0.003;
                            break;
                        default:
                            yawRate = 0;
                            speed = 0;
                            walkBell.play();
                            break;
                    }
                    break;
                case ('mes'):
                    alert(evt.mes);
                    break;
                default:
                    break;
            }
            animate();
            okRequestAnimationFrame(tick);
        },
        200);
}
