var childProcess = require('child_process'),
	nodeUtil = require('util'),
	nodeExec = childProcess.exec;


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
var Util = {
	execCmd: function(cmdItem) {
		var cmdStr = Util.getCmdString(cmdItem);
		var callback = (function(cmd, error, stdout, stderr) {
			this.callback && this.callback.call(this.scope || this, {
				error: error,
				stdout: stdout,
				stderr: stderr,
				cmd: cmd
			}, this);
		}).bind(cmdItem, cmdStr);

		return Util.exec(cmdStr, cmdItem.option, callback);
	},
	getCmdString: function(cmdItem) {
		var name = cmdItem.cmdName,
			args = cmdItem.args,
			cmdStr = '';

		args.unshift(name);
		cmdStr = args.join(' ');

		return cmdStr;
	},
	exec: function(cmd, option, callback) {
		if (typeof(option) == 'function') {
			callback = option;
			option = null;
		}

		nodeExec(cmd, option, callback);
	}
};

module.exports = Util;