var CmdUtil = require('./cmd-util'),
	QueueCmd = require('./queue-cmd');


/**
 * 定义
 */
var Cmd = function(name, cwd) {
	this.name = name || this.name;
	this.cwd = cwd || this.cwd;
	this.queueCmd = new QueueCmd();
};

Cmd.prototype = {
	name: '',
	cwd: '',
	args: [],
	/**
	 * 设置当前运行路径
	 */
	setCwd: function(cwd) {
		this.cwd = cwd;
	},
	_getCmdItem: function(args, option, callback) {
		if (typeof(option) == 'function') {
			callback = option;
			option = {};
		}
		option.cwd = option.cwd || this.cwd;

		args = [].concat(this.args, args);

		var cmdItem = {
			cmdName: this.name,
			args: args,
			option: option,
			callback: callback,
			scope: this
		};

		return cmdItem;
	},
	/**
	 * 串联执行命令
	 * @param args 命令执行的参数
	 * @param callback 回调方法
			error 错误
			stdout 标准输出
			stderr 标准异常
	 */
	queueExec: function(args, option, callback) {
		var cmdItem = this._getCmdItem(args, option, callback);

		var cmdStr = CmdUtil.getCmdString(cmdItem);
		return this.queueCmd.queue(cmdStr, cmdItem.option, cmdItem.callback);
	},
	/**
	 *@desc 并联执行
	 */
	exec: function(args, option, callback) {
		var cmdItem = this._getCmdItem(args, option, callback);

		CmdUtil.execCmd(cmdItem);
		return cmdItem;
	}
};


Cmd.exec = CmdUtil.exec;
Cmd.queue = function(cmd, option, callback) {
	var ins = new QueueCmd();
	ins.queue(cmd, option, callback);

	return ins;
};
Cmd.QueueCmd = QueueCmd;

module.exports = Cmd;