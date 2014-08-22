var NodeCmd = require('../index');
var QueueCmd = NodeCmd.QueueCmd;


var ins = new QueueCmd();

ins
	.queue('npm -v', function(data) {
		console.log(data.stdout);
	})
	.queue('svn help', function(data) {
		console.log(data.stdout);
	})
	.queue(function() {
		console.log('all cmd is execed!');
	});