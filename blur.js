//检测范围
function inRange(i, width, height)
{
	return ((i >= 0) && (i < width * height * 4));
}
//模糊,每个像素按邻居取平均
function averageNeighbors(imageData, width, height, i)
{
	//原本
	var v = imageData[i];
	//八个邻居
	var north = inRange(i-width*4, width, height) ? imageData[i-width*4] : v;
	var south = inRange(i+width*4, width, height) ? imageData[i+width*4] : v;
	var west = inRange(i-4, width, height) ? imageData[i-4] : v;
	var east = inRange(i+4, width, height) ? imageData[i+4] : v;
	var ne = inRange(i-width*4+4, width, height) ? imageData[i-width*4+4] : v;
	var nw = inRange(i-width*4-4, width, height) ? imageData[i-width*4-4] : v;
	var se = inRange(i+width*4+4, width, height) ? imageData[i+width*4+4] : v;
	var sw = inRange(i+width*4-4, width, height) ? imageData[i+width*4-4] : v;
	//取平均
	var newVal = Math.floor((north + south + east + west + se + sw + ne + nw + v) / 9);
	if(isNaN(newVal))
	{
		sendStatus("bad value " + i + " for height " + height);
		throw new Error("NaN");
	}
	return newVal;
}
//模糊主函数
function boxBlur(imageData, width, height)
{
	var data = [];
	var val = 0;

	for(var i = 0; i < width*height*4; ++i)
	{
		val = averageNeighbors(imageData, width, height, i);
		data[i] = val;
	}
	return data;
}
