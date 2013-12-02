//穿越检测(根据地图特性降维处理线段即可)
var isxWall = false;
var isyWall = false;
var mapMatrix = null;
var xPos = 0;
var zPos = 0;
var order = null;
var yaw = 0;
var t = 0;
//针对每面墙
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
//角度转弧度
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
//判断能否移动
function canMove(mySpeed) {
    var timeNow = new Date().getTime();
    var myElapsed = timeNow - t;
    if (mySpeed != 0) {
        var tempxPos = xPos - Math.sin(degToRad(yaw)) * mySpeed * myElapsed;
        var tempzPos = zPos - Math.cos(degToRad(yaw)) * mySpeed * myElapsed;
        isxWall = false;
        isyWall = false;
        canBeCross(xPos, zPos, tempxPos, tempzPos);
        return (isxWall == false && isyWall == false);
    }
    return true;
}
//AI
function AI() {
    while (yaw >= 360)
        yaw -= 360;
    while (yaw < 0)
        yaw += 360;
    if (canMove(0.03))
        order = 2;
    else {
        var tempYaw = yaw;
        order = 0;
        yaw -= 80;
        if (canMove(0.03))
            order = 1;
        yaw += 160;
        if (canMove(0.03))
            order = 0;
        yaw = tempYaw;
    }
}
//接受信息，注意信息收发的格式
function getMes(e) {
    //捕获信息
    var messageType = e.data.type; //收到的信息
    //信息分类处理
    switch (messageType) {
        case ('mes'):
            mapMatrix = e.data.mapMatrix; //收到的信息
            xPos = e.data.xPos;
            zPos = e.data.zPos;
            t = e.data.t; //时间
            yaw = e.data.yaw; //角度
            order = null;
            AI();
            //发送信息
            if(order != null)
                postMessage({
                    'type': 'order',
                    'myOrder': order
                });
            break;
    }
}
addEventListener("message", getMes, true);