var Cmd = require('../index.js');

var npmCmd = new Cmd('npm');

npmCmd.queueExec(['ls','-g'], function(ret) {
	if (ret.error) {
		console.log('error:' + ret.error);
	} else if (ret.stdout) {
		console.log('strout:' + ret.stdout);
	} else if (ret.stderr) {
		console.log('stderr:' + ret.stderr);
	}
});