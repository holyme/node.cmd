var Cmd = require('../index');

/**
 *系统命令
 */
var SysCmd = Cmd.extend({
	isSysCmd: true,
	dir: function(args) {
		args = ['dir'].concat(args);

		this.exec(args, function(ret) {
			if (ret.stdout) {
				console.log('stdout:' + ret.stdout);
			} else if (ret.stderr) {
				console.log('stderr:' + ret.stderr);
			} else if (ret.error) {
				console.log('error:' + ret.error);
			}
		});
	},
	ping: function(args) {
		args = ['ping'].concat(args);

		this.exec(args, function(ret) {
			if (ret.stdout) {
				console.log('stdout:' + ret.stdout);
			} else if (ret.stderr) {
				console.log('stderr:' + ret.stderr);
			} else if (ret.error) {
				console.log('error:' + ret.error);
			}
		});
	}
});

module.exports = SysCmd;