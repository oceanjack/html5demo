//ע��workerû�з���document��Ȩ��
//���Ե�������js�ļ�Ҫ�����·�ʽ
importScripts("blur.js");
//������Ϣ
function sendStatus(statusText)
{
	postMessage({'type' : 'status', 'statusText' : statusText});
}
//��Ϣ����
function messageHandler(e)
{
	//������Ϣ
	var messageType = e.data.type;
	//��Ϣ���ദ��
	switch(messageType)
	{
		case ("blur"):
			sendStatus("Worker started blur on data in range:" + e.data.startX + "-" + (e.data.startX + e.data.width));
			var imageData = e.data.imageData;
			//ģ������
			imageData = boxBlur(imageData, e.data.width, e.data.height, e.data.startX);
			//�������ڴ������Ϣ
			postMessage({'type' : 'progress',
						'imageData' : imageData,
						'width' : e.data.width,
						'height' : e.data.height,
						'startX' : e.data.startX});
			//���ʹ�����������Ϣ
			sendStatus("Finished blur on data in range: " + e.data.startX + "-" + (e.data.width + e.data.startX));
			break;
		default:
			sendStatus("Worker got message: " + e.data);
			break;
	}
}
//��Ӽ���,��������webWorkers.html�д�����worker���͵���Ϣ
addEventListener("message", messageHandler, true);
