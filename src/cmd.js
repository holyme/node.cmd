var childProcess = require('child_process'),
exec = childProcess.exec,
spawn = childProcess.spawn;

var isArray = function (value) {
	return Object.prototype.toString.apply(value) === '[object Array]';
};

var Cmd = function (name, cwd) {
	this.name = name;
	this.cwd = cwd;
};
Cmd.extend = function (ext, fn) {
	var fn = fn || function (cwd) {
		this.cwd = cwd;
	};

	fn.prototype = cmdPrototype;

	for (var e in ext) {
		fn.prototype[e] = ext[e];
	}

	return fn;
};
var cmdPrototype = Cmd.prototype = {
	name : '',
	cwd : '',
	/**
	 * ���õ�ǰ����·��
	 */
	setCwd : function (cwd) {
		this.cwd = cwd;
	},
	/**
	 * ����ִ������
	 * @param params ����ִ�еĲ���
	 * @param callback �ص�����
	error ����
	stdout ��׼���
	stderr ��׼�쳣
	 */
	queryExec : function (params, callback) {
		if (arguments.length == 1 && typeof(params) == 'function') {
			callback = params;
			params = null;
		}

		var _cmdStr = CmdHelper.getCmdString(this.name, params);

		var option = {};
		if (this.cwd) {
			option.cwd = this.cwd;
		}
		CmdHelper.exec(_cmdStr, option, callback);
	},

	/**
	 *@desc ����ִ��
	 */
	exec : function (params, callback) {
		params = isArray(params) ? params : [params];
		var option = {};

		if (this.cwd) {
			option.cwd = this.cwd;
		}
		var count = 0;
		for (var i = 0, len = params.length; i < len; i++) {
			var _str = CmdHelper.getCmdString(this.name, params[i]);
			//ִ��
			exec(_str, option, function (error, stdout, stderr) {
				count++;
				if (count == len) {
					callback(error, stdout, stderr);
				}
			});
		}
	}
};

var CmdHelper = {
	isRunning : false,
	list : [],
	/**
	 * ��ȡcmd������ַ���
	 * @param params �������еĲ���
	 */
	getCmdString : function (name, params) {
		var _cmd = [name];
		var paramsType = typeof(params);

		switch (paramsType) {
		case 'string':
			_cmd.push(params);
			break;
		case 'object':
			if (isArray(params)) {
				_cmd = _cmd.concat(params);
			} else {
				for (var key in params) {
					var val = params[key];
					_cmd.push(key);
					if (val) {
						_cmd.push(val);
					}
				}
			}
			break;
		}
		return _cmd.join(' ');
	},
	/**
	 * ִ����һ������
	 */
	doNext : function () {
		var _cmd = CmdHelper.list.shift();
		if (_cmd) {
			exec(_cmd.cmd, _cmd.option, (function () {
					this.callback.apply(this, arguments);

					CmdHelper.doNext();
				}).bind(_cmd));
		} else {
			CmdHelper.isRunning = false;
		}
	},
	/**
	 * ��ʼִ������
	 */
	run : function () {
		if (!CmdHelper.isRunning) {
			CmdHelper.isRunning = true;
			CmdHelper.doNext();
		}
	},
	/**
	 * ִ��
	 */
	exec : function (cmd, option, callback) {
		CmdHelper.list.push({
			cmd : cmd,
			option : option,
			callback : callback
		});

		CmdHelper.run();
	}
};

module.exports = Cmd;
