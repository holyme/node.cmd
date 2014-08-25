var CmdUtil = require('./cmd-util');

var QueueCmd = function() {
	this.list = [];
	this.isRunning = false;
};

QueueCmd.prototype = {
	exec: function(cmd, option, callback) {
		if (typeof(option) == 'function') {
			callback = option;
			option = {};
		}
		CmdUtil.exec(cmd, option, callback);
	},
	queue: function(cmd, option, callback) {
		if (typeof(option) == 'function') {
			callback = option;
			option = {};
		}
		this.list.push({
			cmd: cmd,
			option: option,
			callback: callback
		});
		this.run();
		return this;
	},
	run: function() {
		if (!this.isRunning) {
			this.isRunning = true;
			var item = this.list.shift();
			if (item) {
				var cmd = item.cmd,
					callback = (function(item, err, stdout, stderr) {

						item.callback && item.callback({
							err: err,
							stdout: stdout,
							stderr: stderr
						});
						this.isRunning = false;
						this.run();
					}).bind(this, item);


				if (typeof(cmd) == 'function') { //如果是function 直接执行
					cmd();
					this.isRunning = false;
					this.run();
				} else {
					CmdUtil.exec(cmd, item.option, callback);
				}
			} else {
				this.isRunning = false;
			}
		}
	}
};

module.exports = QueueCmd;