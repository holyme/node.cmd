var Cmd = require('../index');

var ins = new Cmd('');
ins.exec('ipconfig', function(data) {
	console.log(data.stdout);
});