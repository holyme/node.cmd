var childProcess = require('child_process'),
	nodeSpawn = childProcess.spawn,
	nodeUtil = require('util');


var sysCmdArgs = [],
	sysCmdName = '',
	sysOption = {};
if (process.platform === 'win32') {
	sysCmdName = 'cmd.exe';
	sysCmdArgs = ['/s', '/c'];
	//sysOption.windowsVerbatimArguments = true;
} else {
	sysCmdName = '/bin/sh';
	sysCmdArgs = ['-c'];
}



/**
 * 定义
 */
var Cmd = function(name, cwd) {
	this.name = name || this.name;
	this.cwd = cwd || this.cwd;
};

/**
* 该方法用于新的类继承Cmd
* @params extension 扩展的方法
{
	update:function(){
		//...
	}
}
*/
var extend = function(superclass, extension) {
	var clazz = function(name, cwd) {
		if (arguments.length == 1) {
			cwd = name;
			name = this.name;
		}

		this.name = name || this.name;
		this.cwd = cwd || this.cwd;
	};
	nodeUtil.inherits(clazz, superclass);

	nodeUtil._extend(clazz.prototype, extension);

	clazz.extend = function(extension) {
		//return extend(this, extension, _fn);
		return extend(this, extension);
	};

	return clazz;
};

/**
 * 定义扩展方法
 */
Cmd.extend = function(extension) {
	return extend(Cmd, extension);
};
/**
 *注册命令
 */
/*Cmd.register = function(config) {
	var clazz = Cmd.extend(config.attrs);

	return clazz;
};*/
Cmd.prototype = {
	name: '',
	cwd: '',
	args: [],
	isSysCmd: false,
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

		//cmdUtil.addQueue(this.name, args, option, callback, this.isSysCmd);
		cmdUtil.addQueue({
			cmdName: this.name,
			args: args,
			option: option,
			callback: callback,
			scope: scope || this,
			isSysCmd: this.isSysCmd
		});
	},

	/**
	 *@desc 并联执行
	 */
	exec: function(args, callback, scope) {
		var option = {};
		args = [].concat(this.args, args);

		option.cwd = option.cwd || this.cwd;
		cmdUtil.execCmd({
			cmdName: this.name,
			args: args,
			option: option,
			callback: callback,
			scope: this,
			isSysCmd: this.isSysCmd
		});
	}
};

var cmdUtil = {
	isRunning: false,
	queue: [],
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
	doNext: function() {
		var cmdItem = cmdUtil.queue.shift();
		if (cmdItem) {
			var ns = execCmd(cmdItem);
			ns.on('close', cmdUtil.doNext);
		} else {
			cmdUtil.isRunning = false;
		}
	},
	execCmd: function(cmdItem) {
		var name = cmdItem.cmdName,
			args = cmdItem.args,
			option = cmdItem.option;

		if (cmdItem.isSysCmd) {
			args = [].concat(sysCmdArgs);
			if (name) {
				args = args.concat(name);
			}
			args = args.concat(cmdItem.args);
			name = sysCmdName;
			option = nodeUtil._extend({}, option);
			option = nodeUtil._extend(option, sysOption);
		}

		console.log('name:' + name);
		console.log('args:' + args);
		console.log('option:' + nodeUtil.inspect(option));
		var ns = nodeSpawn(name, args, option);
		cmdUtil.bindEvent(ns, cmdItem);
		return ns;
	},
	bindEvent: function(ns, cmdItem) {
		ns.stdout.on('data', (function(data) {
			this.stdout = data;
		}).bind(cmdItem));
		ns.stderr.on('data', (function(data) {
			this.stderr = data;
		}).bind(cmdItem));

		ns.on('error', (function(data) {
			this.error = data;
			if (this.callback) {
				this.callback.call(this.scope, {
					stdout: this.stdout,
					stderr: this.stderr,
					error: data
				});
			}
		}).bind(cmdItem));

		ns.on('close', (function(code) {
			if (this.callback) {
				this.callback.call(this.scope, {
					stdout: this.stdout,
					stderr: this.stderr,
					error: this.error
				});
			}
		}).bind(cmdItem));
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