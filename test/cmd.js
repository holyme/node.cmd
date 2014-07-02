var Cmd = require('../index');
var cmd = new Cmd();
cmd.isSysCmd = true;
cmd.setCwd('c:/');
cmd.exec('dir', function(ret) {
	console.log(ret.stdout.toString('utf8'));
});