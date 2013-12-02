function PlatformAiJsExec() {

	this._framework_translateAsync = function() {
		var arg = arguments;
		return function() {
			arg[3].terminate();
			platform_ai_js_exec._framework_recursionNotify(null, arg[0],
					arg[1], arg[2], arg[3], arg[4]);
		};
	};

	this._framework_recursionNotify = function(data, i, urlArr, content,
			worker, caseTimeout) {
		if (data == null || data == '') {
			if (i >= urlArr.length || urlArr[i] == '')
				worker.notifyFunc('');
			else
				platform_ai_js_exec._framework_singalScript(i, urlArr, content,
						worker.notifyFunc, caseTimeout);
		} else
			worker.notifyFunc(data);
	};

	this._framework_singalScript = function(i, urlArr, content, notifyFunc,
			caseTimeout) {
		try {
			var worker = new Worker(urlArr[i]);
			worker.notifyFunc = notifyFunc;
			worker.timer = setTimeout(platform_ai_js_exec
					._framework_translateAsync(i + 1, urlArr, content, worker,
							caseTimeout), caseTimeout || 500);
			worker.addEventListener('message', function(e) {
				clearTimeout(worker.timer);
				platform_ai_js_exec._framework_recursionNotify(e.data, i + 1,
						urlArr, content, worker, caseTimeout);
				worker.terminate();
			}, false);
			worker.postMessage(content);
		} catch (e) {
			alert(e.message);
		}
	};

	this.executeMultipleProcess = function(urls, content, notifyFunc,
			caseTimeout) {
		if (urls == 'null' || urls == 'null,' || urls == '')
			notifyFunc('');
		else
			platform_ai_js_exec._framework_singalScript(0, urls.split(','),
					content, notifyFunc, caseTimeout);
	};
}

var platform_ai_js_exec = new PlatformAiJsExec();
