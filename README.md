# demo

	var Cmd = require('node.cmd');
	var git = new Cmd('git', 'path/to/bin');
	git.exec('list', {
		'l': 5
	}, function(data) {
		// ...
	});