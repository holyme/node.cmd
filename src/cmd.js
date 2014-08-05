var childProcess = require('child_process'),
	nodeExec = childProcess.exec,
	nodeUtil = require('util');

/**
 * 定义
 */
var Cmd = function(name, cwd) {
	this.name = name || this.name;
	this.cwd = cwd || this.cwd;
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
	/**
	 * 串联执行命令
	 * @param args 命令执行的参数
	 * @param callback 回调方法
			error 错误
			stdout 标准输出
			stderr 标准异常
	 */
	queueExec: function(args, option, callback, scope) {
		var option = {};
		option.cwd = option.cwd || this.cwd;
		args = [].concat(this.args, args);

		cmdUtil.addQueue({
			cmdName: this.name,
			args: args,
			option: option,
			callback: callback,
			scope: scope || this
		});
	},

	/**
	 *@desc 并联执行
	 */
	exec: function(args, option, callback, scope) {
		var option = option || {};
		option.cwd = option.cwd || this.cwd;

		args = [].concat(this.args, args);
		cmdUtil.execCmd({
			cmdName: this.name,
			args: args,
			option: option,
			callback: callback,
			scope: this
		});
	}
};

/**
 * 执行下一条命令
 cmdItem:{
	cmdName:'',
	args:[],
	option:{},
	callback:function(ret){
		ret:{
			stdout:''
			stderr:'',
			code:''
		}
	},
	scope:[Object],
	stdout:''
	stderr:'',
	code:''
 }
 */
var cmdUtil = {
	isRunning: false,
	queue: [],
	doNext: function() {
		var cmdItem = cmdUtil.queue.shift();
		if (cmdItem) {
			cmdItem._callback = cmdItem.callback;

			//此处改造原配置的callback
			cmdItem.callback = function(data, cmdItem) {
				if (cmdItem._callback) {
					cmdItem._callback.call(cmdItem.scope, data); //执行预定义的callback
				}
				cmdUtil.doNext(); //再执行
			};
		} else {
			cmdUtil.isRunning = false;
		}
	},
	execCmd: function(cmdItem) {
		var name = cmdItem.cmdName,
			args = cmdItem.args,
			option = cmdItem.option,
			cmdStr = '';

		args.unshift(name);
		cmdStr = args.join(' ');
		return nodeExec(cmdStr, option, (function(error, stdout, stderr) {
			if (this.callback) {
				this.callback.call(this.scope || this, {
					error: error,
					stdout: stdout,
					stderr: stderr
				}, this);
			}
		}).bind(cmdItem), option);
	},
	/**
	 * 开始执行命令
	 */
	run: function() {
		if (!cmdUtil.isRunning) {
			cmdUtil.isRunning = true;
			cmdUtil.doNext();
		}
	},
	/**
	 * 添加到队列中
	 */
	addQueue: function(cmdName, args, option, callback, scop, isSysCmd) {
		if (typeof(cmdName) == 'object' && arguments.length == 1) {
			cmdUtil.queue.push(cmdName);
		} else {
			cmdUtil.queue.push({
				cmdName: cmdName,
				args: args,
				option: option,
				scope: scope,
				isSysCmd: isSysCmd,
				callback: callback
			});
		}

		cmdUtil.run();
	}
};

module.exports = Cmd;