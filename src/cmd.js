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
	 * 设置当前运行路径
	 */
	setCwd : function (cwd) {
		this.cwd = cwd;
	},
	/**
	 * 串联执行命令
	 * @param params 命令执行的参数
	 * @param callback 回调方法
	error 错误
	stdout 标准输出
	stderr 标准异常
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
	 *@desc 并联执行
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
			//执行
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
	 * 获取cmd命令的字符串
	 * @param params 给命令行的参数
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
	 * 执行下一条命令
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
	 * 开始执行命令
	 */
	run : function () {
		if (!CmdHelper.isRunning) {
			CmdHelper.isRunning = true;
			CmdHelper.doNext();
		}
	},
	/**
	 * 执行
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
