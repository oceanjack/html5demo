//注意worker没有访问document的权限
//所以导入其他js文件要用如下方式
importScripts("blur.js");
//发送消息
function sendStatus(statusText)
{
	postMessage({'type' : 'status', 'statusText' : statusText});
}
//信息处理
function messageHandler(e)
{
	//捕获信息
	var messageType = e.data.type;
	//信息分类处理
	switch(messageType)
	{
		case ("blur"):
			sendStatus("Worker started blur on data in range:" + e.data.startX + "-" + (e.data.startX + e.data.width));
			var imageData = e.data.imageData;
			//模糊处理
			imageData = boxBlur(imageData, e.data.width, e.data.height, e.data.startX);
			//发送正在处理的消息
			postMessage({'type' : 'progress',
						'imageData' : imageData,
						'width' : e.data.width,
						'height' : e.data.height,
						'startX' : e.data.startX});
			//发送处理结束后的消息
			sendStatus("Finished blur on data in range: " + e.data.startX + "-" + (e.data.width + e.data.startX));
			break;
		default:
			sendStatus("Worker got message: " + e.data);
			break;
	}
}
//添加监听,接受来自webWorkers.html中创建的worker发送的信息
addEventListener("message", messageHandler, true);
