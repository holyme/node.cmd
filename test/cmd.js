var Cmd = require('../index');

var ins = new Cmd('npm');
ins.exec('-v', function(data) {
	console.log(data);
});