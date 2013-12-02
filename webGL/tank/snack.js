var gl;
var canvas;
//地，空
var pos, color, text;
var pos2, color2, text2;
//墙
var wallpos = [];
var wallcolor;
var walltext;
//坦克
var tank1pos = [];
var tank1color;
var tank1text;
var tank2pos = [];
var tank2color;
var tank2text;
//键盘记录
var currentlyPressedKeys = [];
//位置视角
var rotX = -42.0 / 180 * Math.PI;
var rotY = 0.0;
var rotZ = 47.0 / 180 * Math.PI;
var posX = 80.0;
var posY = 80.0;
var posZ = -150.0;
//坦克位置视角
var tank1posX = 0.0;
var tank1posY = 0.0;
var tank1rot = 0.0;
var tank2posX = 0.0;
var tank2posY = 0.0;
var tank2rot = 0.0;
//已加载资源计数
var srcCnt = 0;
//指令
var TURNLEFT = 0;
var MOVE = 1;
var TURNRIGHT = 2;
var BACK = 3;
var ATC = 4;
//炮弹点
var paopos = [];
var paocolor = [];
var paotext;
//干扰炮
var gpaoposX = 0.0;
var gpaoposY = 0.0;
var gpaoposZ = 0.0;
var gpaorotX = 0.0;
var gpaorotY = 0.0;
var gpaorotZ = 0.0;
var gpaospeedX = 0.0;
var gpaospeedY = 0.0;
var gpaospeedZ = 0.0;
var gpaouse = false;
var gpaot = 0.0;
var gpaoval = 0;
var nowGpaoPosX = 0.0;
var nowGpaoPosY = 0.0;
var nowGpaoPosZ = 0.0;
var gBreakTime = 0;
//坦克1炮
var tank1paoposX = 0.0;
var tank1paoposY = 0.0;
var tank1paoposZ = 0.0;
var tank1paospeedX = 0.0;
var tank1paospeedY = 0.0;
var tank1paospeedZ = 0.0;
var tank1paorotZ = 0.0;
var tank1paouse = false;
var tank1paot = 0.0;
var tank1paoval = 0;
var tank1paoatc = 0;
var nowTank1PaoPosX = 0.0;
var nowTank1PaoPosY = 0.0;
var nowTank1PaoPosZ = 0.0;
var tank1BreakTime = 0;
//坦克2炮
var tank2paoposX = 0.0;
var tank2paoposY = 0.0;
var tank2paoposZ = 0.0;
var tank2paospeedX = 0.0;
var tank2paospeedY = 0.0;
var tank2paospeedZ = 0.0;
var tank2paorotZ = 0.0;
var tank2paouse = false;
var tank2paot = 0.0;
var tank2paoval = 0;
var tank2paoatc = 0;
var nowTank2PaoPosX = 0.0;
var nowTank2PaoPosY = 0.0;
var nowTank2PaoPosZ = 0.0;
var tank2BreakTime = 0;
//爆炸位置
var zhaPosX = [0, 0, 0];
var zhaPosY = [0, 0, 0];
var zhaPosZ = [0, 0, 0];
var zhaT = [0, 0, 0];
var zhaText = null;
//音乐音效资源
var backSrc = null;
var baoSrc = null;
var bao1Src = null;
var bao2Src = null;
var move1Src = null;
var move2Src = null;
var atcSrc = null;
var atc1Src = null;
var atc2Src = null;
var backMusic = null;
var baoMusic = null;
var bao1Music = null;
var bao2Music = null;
var move1Music = null;
var move2Music = null;
var atcMusic = null;
var atc1Music = null;
var atc2Music = null;
function setPao() {
    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];

    var latitudeBands = 30;
    var longitudeBands = 30;
    var radius = 2;
    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);

            normalData.push(x);
            normalData.push(y);
            normalData.push(z);
            textureCoordData.push(u);
            textureCoordData.push(v);
            vertexPositionData.push(radius * x);
            vertexPositionData.push(radius * y);
            vertexPositionData.push(radius * z);
        }
    }

    var indexData = [];
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);

            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }

    var len = indexData.length;
    for (var k = 0, head = 0; k < len; k += 6, ++head) {
        var id1 = indexData[k] * 3;
        var id2 = indexData[k + 2] * 3;
        var id3 = indexData[k + 1] * 3;
        var id4 = indexData[k + 4] * 3;
        var pos1 = [vertexPositionData[id1], vertexPositionData[id1 + 1], vertexPositionData[id1 + 2]];
        var pos2 = [vertexPositionData[id2], vertexPositionData[id2 + 1], vertexPositionData[id2 + 2]];
        var pos3 = [vertexPositionData[id3], vertexPositionData[id3 + 1], vertexPositionData[id3 + 2]];
        var pos4 = [vertexPositionData[id4], vertexPositionData[id4 + 1], vertexPositionData[id4 + 2]];
        paopos[head] = gl.prepareObject(pos1.concat(pos2).concat(pos3).concat(pos4));

        id1 = indexData[k] * 2;
        id2 = indexData[k + 2] * 2;
        id3 = indexData[k + 1] * 2;
        id4 = indexData[k + 4] * 2;
        var col1 = [textureCoordData[id1], textureCoordData[id1 + 1]];
        var col2 = [textureCoordData[id2], textureCoordData[id2 + 1]];
        var col3 = [textureCoordData[id3], textureCoordData[id3 + 1]];
        var col4 = [textureCoordData[id4], textureCoordData[id4 + 1]];
        paocolor[head] = gl.prepareObject(col1.concat(col2).concat(col3).concat(col4));
    }
    paotext = gl.prepareTexture(document.getElementById('moon'));
}
function setPoints() {
    // 地
    pos = gl.prepareObject([-105, -105, -2,
                105, -105, -2,
                -105, 105, -2,
                105, 105, -2]); // 点阵，3个一组
    color = gl.prepareObject([0, 0,
                  0, 10,
                  10, 0,
                  10, 10]); // 纹理坐标，2个一组
    text = gl.prepareTexture(document.getElementById('grass')); // 纹理用图
    // 天
    pos2 = gl.prepareObject([-102400, -102400, 150,
                102400, -102400, 150,
                -102400, 102400, 150,
                102400, 102400, 150]);
    color2 = gl.prepareObject([0, 0,
                  0, 256,
                  256, 0,
                  256, 256]);
    text2 = gl.prepareTexture(document.getElementById('sky')); // 纹理用图
    // 墙
    wallpos[0] = gl.prepareObject([-105, -105, -2,
                 -105, 105, -2,
                 -105, -105, 48,
                 -105, 105, 48]);
    wallpos[1] = gl.prepareObject([105, -105, -2,
                 105, 105, -2,
                 105, -105, 48,
                 105, 105, 48]);
    wallpos[2] = gl.prepareObject([-105, -105, -2,
                 105, -105, -2,
                 -105, -105, 48,
                 105, -105, 48]);
    wallpos[3] = gl.prepareObject([-105, 105, -2,
                 105, 105, -2,
                 -105, 105, 48,
                 105, 105, 48]);
    wallcolor = gl.prepareObject([2, 1,
                   0, 1,
                   2, 0,
                   0, 0]);
    walltext = gl.prepareTexture(document.getElementById('wall')); // 纹理用图
    //坦克1
    tank1pos[0] = gl.prepareObject([-53, -53, 0,
                -42, -53, 0,
                -53, -42, 0,
                -42, -42, 0]);
    tank1pos[1] = gl.prepareObject([-42, -42, -2,
                 -42, -53, -2,
                 -42, -42, 0,
                 -42, -53, 0]);
    tank1pos[2] = gl.prepareObject([-53, -42, -2,
                 -53, -53, -2,
                 -53, -42, 0,
                 -53, -53, 0]);
    tank1pos[3] = gl.prepareObject([-53, -42, -2,
                 -42, -42, -2,
                 -53, -42, 0,
                 -42, -42, 0]);
    tank1pos[4] = gl.prepareObject([-53, -53, -2,
                 -42, -53, -2,
                 -53, -53, 0,
                 -42, -53, 0]);

    tank1pos[5] = gl.prepareObject([-50, -50, 2,
                -45, -50, 2,
                -50, -45, 2,
                -45, -45, 2]);
    tank1pos[6] = gl.prepareObject([-45, -45, 0,
                 -45, -50, 0,
                 -45, -45, 2,
                 -45, -50, 2]);
    tank1pos[7] = gl.prepareObject([-50, -45, 0,
                 -50, -50, 0,
                 -50, -45, 2,
                 -50, -50, 2]);
    tank1pos[8] = gl.prepareObject([-50, -45, 0,
                 -45, -45, 0,
                 -50, -45, 2,
                 -45, -45, 2]);
    tank1pos[9] = gl.prepareObject([-50, -50, 0,
                 -45, -50, 0,
                 -50, -50, 2,
                 -45, -50, 2]);

    tank1pos[10] = gl.prepareObject([-47.5, -48, 1,
               -41, -48, 1,
               -47.5, -47, 1,
               -41, -47, 1]);
    tank1pos[11] = gl.prepareObject([-47.5, -48, 1.5,
               -41, -48, 1.5,
               -47.5, -47, 1.5,
               -41, -47, 1.5]);
    tank1pos[12] = gl.prepareObject([-47.5, -48, 1,
                 -41, -48, 1,
                 -47.5, -48, 1.5,
                 -41, -48, 1.5]);
    tank1pos[13] = gl.prepareObject([-47.5, -47, 1,
                 -41, -47, 1,
                 -47.5, -47, 1.5,
                 -41, -47, 1.5]);

    tank1color = gl.prepareObject([0, 0,
                  0, 2,
                  2, 0,
                  2, 2]);
    tank1text = gl.prepareTexture(document.getElementById('tank1')); // 纹理用图

    //坦克2
    tank2pos[0] = gl.prepareObject([53, 53, 0,
                42, 53, 0,
                53, 42, 0,
                42, 42, 0]);
    tank2pos[1] = gl.prepareObject([42, 42, -2,
                 42, 53, -2,
                 42, 42, 0,
                 42, 53, 0]);
    tank2pos[2] = gl.prepareObject([53, 42, -2,
                 53, 53, -2,
                 53, 42, 0,
                 53, 53, 0]);
    tank2pos[3] = gl.prepareObject([53, 42, -2,
                 42, 42, -2,
                 53, 42, 0,
                 42, 42, 0]);
    tank2pos[4] = gl.prepareObject([53, 53, -2,
                 42, 53, -2,
                 53, 53, 0,
                 42, 53, 0]);

    tank2pos[5] = gl.prepareObject([50, 50, 2,
                45, 50, 2,
                50, 45, 2,
                45, 45, 2]);
    tank2pos[6] = gl.prepareObject([45, 45, 0,
                 45, 50, 0,
                 45, 45, 2,
                 45, 50, 2]);
    tank2pos[7] = gl.prepareObject([50, 45, 0,
                 50, 50, 0,
                 50, 45, 2,
                 50, 50, 2]);
    tank2pos[8] = gl.prepareObject([50, 45, 0,
                 45, 45, 0,
                 50, 45, 2,
                 45, 45, 2]);
    tank2pos[9] = gl.prepareObject([50, 50, 0,
                 45, 50, 0,
                 50, 50, 2,
                 45, 50, 2]);

    tank2pos[10] = gl.prepareObject([47.5, 48, 1,
                 41, 48, 1,
                 47.5, 47, 1,
                 41, 47, 1]);
    tank2pos[11] = gl.prepareObject([47.5, 48, 1.5,
                 41, 48, 1.5,
                 47.5, 47, 1.5,
                 41, 47, 1.5]);
    tank2pos[12] = gl.prepareObject([47.5, 48, 1,
                 41, 48, 1,
                 47.5, 48, 1.5,
                 41, 48, 1.5]);
    tank2pos[13] = gl.prepareObject([47.5, 47, 1,
                 41, 47, 1,
                 47.5, 47, 1.5,
                 41, 47, 1.5]);

    tank2color = gl.prepareObject([0, 0,
                  0, 2,
                  2, 0,
                  2, 2]);
    tank2text = gl.prepareTexture(document.getElementById('tank2'));

    setPao();

    zhaText = gl.prepareTexture(document.getElementById('moon2'));
    // 绘制颜色插值填充物体
    /*
    pos2 = gl.prepareObject([2.5, 2.5, 5,
                 3.5, 2.5, 5,
                 2.5, 3.5, 5,
                 3.5, 3.5, 5]);
    color2 = gl.prepareObject([1, 0, 0, 1,
                   0, 1, 0, 1,
                   0, 0, 1, 1,
                   1, 0, 1, 1]); // 边角(r,g,b,alpha)，4个一组
                   */
}
//显示信息
function showMsg() {
    var showStr = "";
    showStr += " 旋转:(" + Math.floor(rotX / Math.PI * 180) + "," + Math.floor(rotY / Math.PI * 180) + "," + Math.floor(rotZ / Math.PI * 180) + ")";
    showStr += " 位移:(" + Math.floor(posX) + "," + Math.floor(posY) + "," + Math.floor(posZ) + ")";
    showStr += "<br />";
    showStr += "坦克1 位置:(" + Math.floor(-tank1posX + 47.5) + "," + Math.floor(-tank1posY + 47.5) + ")";
    var realRot = Math.floor(-(tank1rot / Math.PI * 180 - 90));
    showStr += " 角度:" + Math.floor(-(tank1rot / Math.PI * 180 - 90)) % 360;
    showStr += " 炮弹:(" + Math.floor(-nowTank1PaoPosX) + "," + Math.floor(-nowTank1PaoPosY) + "," + Math.floor(-nowTank1PaoPosZ) + ")";
    showStr += " 分数:" + tank1paoval;
    showStr += " 击中:" + tank1paoatc;
    showStr += "<br />";
    showStr += "坦克2 位置:(" + Math.floor(-tank2posX - 47.5) + "," + Math.floor(-tank2posY - 47.5) + ")";
    showStr += "角度:" + Math.floor(-(tank2rot / Math.PI * 180 + 90)) % 360;
    showStr += " 炮弹:(" + Math.floor(-nowTank2PaoPosX) + "," + Math.floor(-nowTank2PaoPosY) + "," + Math.floor(-nowTank2PaoPosZ) + ")";
    showStr += " 分数:" + tank2paoval;
    showStr += " 击中:" + tank2paoatc;
    showStr += "<br />";
    showStr += "干扰炮:(" + Math.floor(-nowGpaoPosX) + "," + Math.floor(-nowGpaoPosY) + "," + Math.floor(-nowGpaoPosZ) + ")";
    showStr += " 分数:" + gpaoval;
    document.getElementById('key').innerHTML = showStr;
}
//记录键盘输入
function handleKeyDown(e) {
    e.preventDefault();
    currentlyPressedKeys[e.keyCode] = true;
}
function handleKeyUp(e) {
    currentlyPressedKeys[e.keyCode] = false;
}
//键盘响应
function handleKeys() {
    if (currentlyPressedKeys[90]) {
        //上
        posZ -= 3;
        if (posZ <= -300)
            posZ = -300;
    }
    if (currentlyPressedKeys[88]) {
        //下
        posZ += 3;
        if (posZ >= -10)
            posZ = -10;
    }
    if (currentlyPressedKeys[33]) {
        //上
        rotX -= Math.PI / 100;
    }
    if (currentlyPressedKeys[34]) {
        //下
        rotX += Math.PI / 100;
    }
    if (currentlyPressedKeys[37]) {
        // 左转
        rotZ -= 1 / Math.PI / 10;
    }
    if (currentlyPressedKeys[39]) {
        // 右转
        rotZ += 1 / Math.PI / 10;
    }
    if (currentlyPressedKeys[38]) {
        // 前
        posY -= Math.cos(rotZ);
        posX -= Math.sin(rotZ);

    }
    if (currentlyPressedKeys[40]) {
        // 后
        posY += Math.cos(rotZ);
        posX += Math.sin(rotZ);
    }

    //坦克1
    if (currentlyPressedKeys[65]) {
        // 左转
        tank1rot += 1 / Math.PI / 3;
    }
    if (currentlyPressedKeys[68]) {
        // 右转
        tank1rot -= 1 / Math.PI / 3;
    }
    if (currentlyPressedKeys[87]) {
        // 前
        move1Music.play();
        tank1posX += Math.cos(tank1rot);
        tank1posY += Math.sin(tank1rot);
        if (checkTankPeng()) {
            tank1posX -= Math.cos(tank1rot);
            tank1posY -= Math.sin(tank1rot);
        }
    }
    if (currentlyPressedKeys[83]) {
        // 退
        move1Music.play();
        tank1posX -= Math.cos(tank1rot);
        tank1posY -= Math.sin(tank1rot);
        if (checkTankPeng()) {
            tank1posX += Math.cos(tank1rot);
            tank1posY += Math.sin(tank1rot);
        }
    }

    //坦克2
    if (currentlyPressedKeys[74]) {
        // 左转
        tank2rot += 1 / Math.PI / 3;
    }
    if (currentlyPressedKeys[76]) {
        // 左转
        tank2rot -= 1 / Math.PI / 3;
    }
    if (currentlyPressedKeys[73]) {
        // 前
        move2Music.play();
        tank2posX -= Math.cos(tank2rot);
        tank2posY -= Math.sin(tank2rot);
        if (checkTankPeng()) {
            tank2posX += Math.cos(tank2rot);
            tank2posY += Math.sin(tank2rot);
        }
    }
    if (currentlyPressedKeys[75]) {
        // 退
        move2Music.play();
        tank2posX += Math.cos(tank2rot);
        tank2posY += Math.sin(tank2rot);
        if (checkTankPeng()) {
            tank2posX -= Math.cos(tank2rot);
            tank2posY -= Math.sin(tank2rot);
        }
    }

    if (currentlyPressedKeys[32] && gpaouse == false && gBreakTime <= 0) {
        // 干扰炮
        atcMusic.play();
        gpaouse = true;
        gpaoval -= 5;
        gpaot = 0.0;
        gpaorotX = rotX;
        gpaorotY = rotY;
        gpaorotZ = rotZ;
        gpaoposX = posX;
        gpaoposY = posY;
        gpaoposZ = posZ;
        gpaospeedZ = 100 * Math.cos(gpaorotX);
        gpaospeedY = 100 * Math.cos(gpaorotZ) * -Math.sin(gpaorotX);
        gpaospeedX = 100 * Math.sin(gpaorotZ) * -Math.sin(gpaorotX);
    }

    if (currentlyPressedKeys[81] && tank1paouse == false) {
        // 坦克1炮
        tank1atc();
    }

    if (currentlyPressedKeys[85] && tank2paouse == false) {
        // 坦克2炮
        tank2atc();
    }
}
//坦克1开炮
function tank1atc() {
    if (tank1BreakTime > 0 || tank1paouse == true)
        return;
    atc1Music.play();
    tank1paouse = true;
    tank1paoval -= 1;
    tank1paot = 0.0;
    tank1paorotZ = -(tank1rot / Math.PI * 180 - 90) / 180 * Math.PI;
    tank1paoposX = -tank1posX + 47.5 - 7 * Math.sin(tank1paorotZ);
    tank1paoposY = -tank1posY + 47.5 - 7 * Math.cos(tank1paorotZ);
    tank1paoposZ = -1;
    tank1paospeedZ = 60 * Math.cos(-0.5 * Math.PI);
    tank1paospeedY = 100 * Math.cos(tank1paorotZ) * -Math.sin(-0.5 * Math.PI);
    tank1paospeedX = 100 * Math.sin(tank1paorotZ) * -Math.sin(-0.5 * Math.PI);
}
//坦克2开炮
function tank2atc() {
    if (tank2BreakTime > 0 || tank2paouse == true)
        return;
    atc2Music.play();
    tank2paouse = true;
    tank2paoval -= 1;
    tank2paot = 0.0;
    tank2paorotZ = -(tank2rot / Math.PI * 180 + 90) / 180 * Math.PI;
    tank2paoposX = -tank2posX - 47.5 - 7 * Math.sin(tank2paorotZ);
    tank2paoposY = -tank2posY - 47.5 - 7 * Math.cos(tank2paorotZ);
    tank2paoposZ = -1;
    tank2paospeedZ = 60 * Math.cos(-0.5 * Math.PI);
    tank2paospeedY = 100 * Math.cos(tank2paorotZ) * -Math.sin(-0.5 * Math.PI);
    tank2paospeedX = 100 * Math.sin(tank2paorotZ) * -Math.sin(-0.5 * Math.PI);
}
//碰撞检测
function checkPeng() {
    //视角边界
    if (posX >= 80)
        posX = 80;
    if (posX <= -80)
        posX = -80
    if (posY >= 80)
        posY = 80;
    if (posY <= -80)
        posY = -80
    //视角角度边界
    if (rotX / Math.PI * 180 <= -180.0)
        rotX = -180.0 / 180 * Math.PI;
    if (rotX / Math.PI * 180 >= -0)
        rotX = -0 / 180 * Math.PI;
    if (rotY / Math.PI * 180 <= -360.0 || rotY / Math.PI * 180 >= 360)
        rotY = 0;
    if (rotZ / Math.PI * 180 <= -360.0 || rotZ / Math.PI * 180 >= 360)
        rotZ = 0;

    //坦克1边界
    if (-47.5 + tank1posX >= 90)
        tank1posX = 90 + 47.5;
    if (-47.5 + tank1posX <= -90)
        tank1posX = -90 + 47.5;
    if (-47.5 + tank1posY >= 90)
        tank1posY = 90 + 47.5;
    if (-47.5 + tank1posY <= -90)
        tank1posY = -90 + 47.5;
    if (tank1rot / Math.PI * 180 >= 360)
        tank1rot = 0;
    if (tank1rot / Math.PI * 180 <= -360)
        tank1rot = 0;

    //坦克2边界
    if (47.5 + tank2posX >= 90)
        tank2posX = 90 - 47.5;
    if (47.5 + tank2posX <= -90)
        tank2posX = -90 - 47.5;
    if (47.5 + tank2posY >= 90)
        tank2posY = 90 - 47.5;
    if (47.5 + tank2posY <= -90)
        tank2posY = -90 - 47.5;
    if (tank2rot / Math.PI * 180 >= 360)
        tank2rot = 0;
    if (tank2rot / Math.PI * 180 <= -360)
        tank2rot = 0;
}
//两坦克判碰撞
function checkTankPeng() {
    if (Math.abs((-47.5 + tank1posX) - (47.5 + tank2posX)) < 11 && Math.abs((-47.5 + tank1posY) - (47.5 + tank2posY)) < 11)
        return true;
    return false;
}
//干扰炮碰撞
function checkGpao() {
    if (Math.abs((-tank1posX + 47.5) - (-nowGpaoPosX)) < 6 && Math.abs((-tank1posY + 47.5) - (-nowGpaoPosY)) < 6 && -nowGpaoPosZ > -2)
        return true;
    if (Math.abs((-tank2posX - 47.5) - (-nowGpaoPosX)) < 6 && Math.abs((-tank2posY - 47.5) - (-nowGpaoPosY)) < 6 && -nowGpaoPosZ > -2)
        return true;
    return false;
}
//坦克1炮碰撞
function checkTank1pao() {
    if (Math.abs((-tank2posX - 47.5) - (-nowTank1PaoPosX)) < 7 && Math.abs((-tank2posY - 47.5) - (-nowTank1PaoPosY)) < 7 && -nowTank1PaoPosZ > -2)
        return true;
    return false;
}
//坦克2炮碰撞
function checkTank2pao() {
    if (Math.abs((-tank1posX + 47.5) - (-nowTank2PaoPosX)) < 7 && Math.abs((-tank1posY + 47.5) - (-nowTank2PaoPosY)) < 7 && -nowTank2PaoPosZ > -2)
        return true;
    return false;
}
//改变视角等参数
function changeVar() {
    --gBreakTime;
    if (gBreakTime <= 0)
        gBreakTime = 0;
    gl.rotate(rotX, [1, 0, 0]);
    gl.rotate(rotY, [0, 1, 0]);
    gl.rotate(rotZ, [0, 0, 1]);
    gl.translate([posX, posY, posZ]);
}
//改变坦克1
function changeTank1() {
    --tank1BreakTime;
    if (tank1BreakTime <= 0)
        tank1BreakTime = 0;
    gl.translate([-47.5 + tank1posX, -47.5 + tank1posY, 0]);
    gl.rotate(tank1rot, [0, 0, 1]);
    gl.translate([47.5, 47.5, 0]);
}
//改变坦克2
function changeTank2() {
    --tank2BreakTime;
    if (tank2BreakTime <= 0)
        tank2BreakTime = 0;
    gl.translate([47.5 + tank2posX, 47.5 + tank2posY, 0]);
    gl.rotate(tank2rot, [0, 0, 1]);
    gl.translate([-47.5, -47.5, 0]);
}
//坦克1逻辑
function getTank1Order() {
    var order = Math.floor((new Date()) / 10000) % 2;
    switch (order) {
        case TURNLEFT:
            tank1rot += 1 / Math.PI / 3;
            break;
        case TURNRIGHT:
            tank1rot -= 1 / Math.PI / 3;
            break;
        case MOVE:
            tank1posX += Math.cos(tank1rot);
            tank1posY += Math.sin(tank1rot);
            if (checkTankPeng()) {
                tank1posX -= Math.cos(tank1rot);
                tank1posY -= Math.sin(tank1rot);
            }
            break;
        case BACK:
            tank1posX -= Math.cos(tank1rot);
            tank1posY -= Math.sin(tank1rot);
            if (checkTankPeng()) {
                tank1posX += Math.cos(tank1rot);
                tank1posY += Math.sin(tank1rot);
            }
            break;
        case ATC:
            tank1atc();
            break;
        default:
            break;
    }
}
//坦克2逻辑
function getTank2Order() {
    var order = Math.floor(Math.random() * 10) % 3 + 2;
    switch (order) {
        case TURNLEFT:
            tank2rot += 1 / Math.PI / 3;
            break;
        case TURNRIGHT:
            tank2rot -= 1 / Math.PI / 3;
            break;
        case MOVE:
            tank2posX -= Math.cos(tank2rot);
            tank2posY -= Math.sin(tank2rot);
            if (checkTankPeng()) {
                tank2posX += Math.cos(tank2rot);
                tank2posY += Math.sin(tank2rot);
            }
            break;
        case BACK:
            tank2posX += Math.cos(tank2rot);
            tank2posY += Math.sin(tank2rot);
            if (checkTankPeng()) {
                tank2posX -= Math.cos(tank2rot);
                tank2posY -= Math.sin(tank2rot);
            }
            break;
        case ATC:
            tank2atc();
            break;
        default:
            break;
    }
}
//改变干扰炮
function changeGpao() {
    nowGpaoPosX = -posX;
    nowGpaoPosY = -posY;
    nowGpaoPosZ = -posZ;
    if (gpaouse == false)
        return;
    gpaot += 0.1;
    nowGpaoPosX = -gpaoposX + gpaospeedX * gpaot;
    nowGpaoPosY = -gpaoposY + gpaospeedY * gpaot;
    nowGpaoPosZ = -gpaoposZ - ((gpaospeedZ + 10 * gpaot) * (gpaospeedZ + 10 * gpaot) - gpaospeedZ * gpaospeedZ) / 20;
    gl.translate([nowGpaoPosX, nowGpaoPosY, nowGpaoPosZ]);
    gl.scale([0.7, 0.7, 0.7]);
    gl.rotate(gpaot * 10, [1, 1, 1]);
    if (checkGpao()) {
        gpaouse = false;
        gpaoval += Math.floor(gpaot * 10);
    }
    if (-nowGpaoPosZ > -50 && (nowGpaoPosX < -100 || nowGpaoPosX > 100 || nowGpaoPosY < -100 || nowGpaoPosY > 100)) {
        gpaouse = false;
    }
    if (-nowGpaoPosZ > -2 || nowGpaoPosX < -500 || nowGpaoPosX > 500 || nowGpaoPosY < -500 || nowGpaoPosY > 500) {
        if (-nowGpaoPosZ > -2)
            nowGpaoPosZ = -2;
        gpaouse = false;
    }
    if (gpaouse == false) {
        gBreakTime = 50;
        zhaT[0] = 50;
        zhaPosX[0] = nowGpaoPosX;
        zhaPosY[0] = nowGpaoPosY;
        zhaPosZ[0] = nowGpaoPosZ;
        baoMusic.play();
    }
}
//改变坦克1炮弹
function changeTank1Pao() {
    if (tank1paouse == false)
        return;
    tank1paot += 0.1;
    nowTank1PaoPosX = -tank1paoposX + tank1paospeedX * tank1paot;
    nowTank1PaoPosY = -tank1paoposY + tank1paospeedY * tank1paot;
    nowTank1PaoPosZ = -tank1paoposZ - ((tank1paospeedZ + 10 * tank1paot) * (tank1paospeedZ + 10 * tank1paot) - tank1paospeedZ * tank1paospeedZ) / 20;
    gl.translate([nowTank1PaoPosX, nowTank1PaoPosY, nowTank1PaoPosZ]);
    gl.scale([0.2, 0.2, 0.2]);
    gl.rotate(gpaot * 10, [1, 1, 1]);
    if (checkTank1pao()) {
        tank1paouse = false;
        ++tank1paoatc;
        tank1paoval += Math.floor(tank1paot * 5);
    }
    if (-nowTank1PaoPosZ > -50 && (nowTank1PaoPosX < -100 || nowTank1PaoPosX > 100 || nowTank1PaoPosY < -100 || nowTank1PaoPosY > 100)) {
        tank1paouse = false;
    }
    if (-nowTank1PaoPosZ > 2 || nowTank1PaoPosX < -500 || nowTank1PaoPosX > 500 || nowTank1PaoPosY < -500 || nowTank1PaoPosY > 500)
        tank1paouse = false;
    if (tank1paouse == false) {
        tank1BreakTime = 50;
        zhaT[1] = 50;
        zhaPosX[1] = nowTank1PaoPosX;
        zhaPosY[1] = nowTank1PaoPosY;
        zhaPosZ[1] = nowTank1PaoPosZ;
        bao1Music.play();
    }
}
//改变坦克2炮弹
function changeTank2Pao() {
    if (tank2paouse == false)
        return;
    tank2paot += 0.1;
    nowTank2PaoPosX = -tank2paoposX + tank2paospeedX * tank2paot;
    nowTank2PaoPosY = -tank2paoposY + tank2paospeedY * tank2paot;
    nowTank2PaoPosZ = -tank2paoposZ - ((tank2paospeedZ + 10 * tank2paot) * (tank2paospeedZ + 10 * tank2paot) - tank2paospeedZ * tank2paospeedZ) / 20;
    gl.translate([nowTank2PaoPosX, nowTank2PaoPosY, nowTank2PaoPosZ]);
    gl.scale([0.2, 0.2, 0.2]);
    gl.rotate(gpaot * 10, [1, 1, 1]);
    if (checkTank2pao()) {
        tank2paouse = false;
        ++tank2paoatc;
        tank2paoval += Math.floor(tank2paot * 5);
    }
    if (-nowTank2PaoPosZ > -50 && (nowTank2PaoPosX < -100 || nowTank2PaoPosX > 100 || nowTank2PaoPosY < -100 || nowTank2PaoPosY > 100)) {
        tank2paouse = false;
    }
    if (-nowTank2PaoPosZ > 2 || nowTank2PaoPosX < -500 || nowTank2PaoPosX > 500 || nowTank2PaoPosY < -500 || nowTank2PaoPosY > 500)
        tank2paouse = false;
    if (tank2paouse == false) {
        tank2BreakTime = 50;
        zhaT[2] = 50;
        zhaPosX[2] = nowTank2PaoPosX;
        zhaPosY[2] = nowTank2PaoPosY;
        zhaPosZ[2] = nowTank2PaoPosZ;
        bao2Music.play();
    }
}
//渲染爆炸
function renderZha() {
    for (var j = 0; j < 3; ++j) {
        if (zhaT[j] > 0) {
            zhaT[j] -= 8;
            if (zhaT[j] < 0)
                zhaT[j] = 0;
            gl.pushMatrix();
            var sca = (50 - zhaT[j]) / 15.0;
            gl.translate([zhaPosX[j], zhaPosY[j], zhaPosZ[j]]);
            gl.rotate(new Date() / 100000 % 360, [1, 1, 1]);
            gl.scale([sca * 1.1, sca * 1.2, sca * 1.3]);
            len = paopos.length;
            for (var i = 0 ; i < len; ++i) {
                gl.displayObject(paopos[i], paocolor[i], zhaText, gl.TRIANGLE_STRIP, 4);
            }
            gl.popMatrix();
        }
    }
}
//渲染物体
function renderObject() {

    var len = 0;
    gl.loadIdentity(); // 对物体变换归零
    changeVar();

    gl.displayObject(pos, color, text, gl.TRIANGLE_STRIP, 4); // 4表示共四组，绘制带纹理物体

    //gl.pushMatrix();
    //gl.rotate(new Date()/200000%360, [0, 0 ,1])
    //gl.displayObject(pos2, color2, text2, gl.TRIANGLE_STRIP, 4);
    //gl.popMatrix();

    ///*
    gl.pushMatrix();
    gl.rotate(new Date() / 200000 % 360, [0, 0, 1]);
    gl.scale([500, 500, 500]);
    len = paopos.length;
    for (var i = 0 ; i < len; ++i) {
        gl.displayObject(paopos[i], paocolor[i], text2, gl.TRIANGLE_STRIP, 4);
    }
    gl.popMatrix();
    //*/

    len = wallpos.length;
    for (var i = 0; i < len ; ++i)
        gl.displayObject(wallpos[i], wallcolor, walltext, gl.TRIANGLE_STRIP, 4);

    //坦克1
    gl.pushMatrix();
    changeTank1();
    len = tank1pos.length;
    for (var i = 0 ; i < len ; ++i)
        gl.displayObject(tank1pos[i], tank1color, tank1text, gl.TRIANGLE_STRIP, 4);
    gl.popMatrix();

    //坦克2
    gl.pushMatrix();
    changeTank2();
    len = tank2pos.length;
    for (var i = 0; i < len; ++i)
        gl.displayObject(tank2pos[i], tank2color, tank2text, gl.TRIANGLE_STRIP, 4);
    gl.popMatrix();

    //干扰炮
    gl.pushMatrix();
    changeGpao();
    if (gpaouse) {
        len = paopos.length;
        for (var i = 0 ; i < len; ++i) {
            gl.displayObject(paopos[i], paocolor[i], paotext, gl.TRIANGLE_STRIP, 4);
        }

    }
    gl.popMatrix();

    //坦克1炮
    gl.pushMatrix();
    changeTank1Pao();
    if (tank1paouse) {
        len = paopos.length;
        for (var i = 0 ; i < len; ++i) {
            gl.displayObject(paopos[i], paocolor[i], paotext, gl.TRIANGLE_STRIP, 4);
        }
    }
    gl.popMatrix();

    //坦克2炮
    gl.pushMatrix();
    changeTank2Pao();
    if (tank2paouse) {
        len = paopos.length;
        for (var i = 0 ; i < len; ++i) {
            gl.displayObject(paopos[i], paocolor[i], paotext, gl.TRIANGLE_STRIP, 4);
        }
    }
    gl.popMatrix();

    renderZha();
}
//渲染
function renderScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.perspective(40.0, gl.viewportWidth / gl.viewportHeight, 0.1, 2000); // 透视矩阵- 视角，纵横比，近裁切面，远裁切面
    gl.lookAt([0, 0, 0], [0, 0, 0], [0, 1, 0]); // 眼睛坐标(0,0,0)，观测目标(0,0,0)，头顶向量(0,1,0)

    backMusic.play();
    handleKeys();
    checkPeng();
    getTank1Order();
    getTank2Order()
    renderObject();
    showMsg();

    setTimeout(renderScene, 50);
}
//音乐音效
function initMusic() {
    backMusic = document.createElement("audio");
    backSrc = document.createElement("source");
    backSrc.setAttribute("src", "back.ogg");
    backSrc.setAttribute("type", "audio/ogg");
    backSrc.setAttribute("loop", "loop");
    backMusic.appendChild(backSrc);
    backMusic.play();

    baoMusic = document.createElement("audio");
    baoSrc = document.createElement("source");
    baoSrc.setAttribute("src", "b.mp3");
    baoSrc.setAttribute("type", "audio/mp3");
    baoMusic.appendChild(baoSrc);

    bao1Music = document.createElement("audio");
    bao1Src = document.createElement("source");
    bao1Src.setAttribute("src", "b.mp3");
    bao1Src.setAttribute("type", "audio/mp3");
    bao1Music.appendChild(bao1Src);

    bao2Music = document.createElement("audio");
    bao2Src = document.createElement("source");
    bao2Src.setAttribute("src", "b.mp3");
    bao2Src.setAttribute("type", "audio/mp3");
    bao2Music.appendChild(bao2Src);

    move1Music = document.createElement("audio");
    move1Src = document.createElement("source");
    move1Src.setAttribute("src", "m.mp3");
    move1Src.setAttribute("type", "audio/mp3");
    move1Music.appendChild(move1Src);

    move2Music = document.createElement("audio");
    move2Src = document.createElement("source");
    move2Src.setAttribute("src", "m.mp3");
    move2Src.setAttribute("type", "audio/mp3");
    move2Music.appendChild(move2Src);

    atcMusic = document.createElement("audio");
    atcSrc = document.createElement("source");
    atcSrc.setAttribute("src", "f.mp3");
    atcSrc.setAttribute("type", "audio/mp3");
    atcMusic.appendChild(atcSrc);

    atc1Music = document.createElement("audio");
    atc1Src = document.createElement("source");
    atc1Src.setAttribute("src", "f.mp3");
    atc1Src.setAttribute("type", "audio/mp3");
    atc1Music.appendChild(atc1Src);

    atc2Music = document.createElement("audio");
    atc2Src = document.createElement("source");
    atc2Src.setAttribute("src", "f.mp3");
    atc2Src.setAttribute("type", "audio/mp3");
    atc2Music.appendChild(atc2Src);
}
//初始化
function initBackground() {
    try {

        canvas = document.getElementById("canvas");
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;

        gl = glTextureShader_latest.loadWebGL('canvas');
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        setPoints();

        setTimeout(renderScene, 100);
    } catch (e) {
        alert('Error:' + e.message);
    }
}
//资源准备计数
function cntSrc() {
    ++srcCnt;
    if (srcCnt >= 7) {
        initMusic()
        initBackground();
    }
}
//加载资源
function getSrc() {
    $('img').bind('load', cntSrc);
}
$(document).bind('ready', getSrc);
$(document).bind('keydown', handleKeyDown);
$(document).bind('keyup', handleKeyUp);