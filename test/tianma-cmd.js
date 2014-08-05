var Cmd = require('../index');


var TianmaCmd = Cmd.extend({
	name: 'tianma',
	start: function() {
		this.exec('start', function(ret) {
			if (ret.stdout) {
				console.log('stdout:' + ret.stdout);
			} else if (ret.stderr) {
				console.log('stderr:' + ret.stderr);
			} else if (ret.error) {
				console.log('error:' + ret.error);
			}
		});
	},
	restart: function() {
		this.exec('restart', function(ret) {
			if (ret.stdout) {
				console.log('stdout:' + ret.stdout);
			} else if (ret.stderr) {
				console.log('stderr:' + ret.stderr);
			}
		});
	},
	stop: function() {
		this.exec('stop', function(ret) {
			if (ret.stdout) {
				console.log('stdout:' + ret.stdout);
			} else if (ret.stderr) {
				console.log('stderr:' + ret.stderr);
			}
		});
	}
});


var test = new TianmaCmd('d:/workspace/tianma/work/');

test.start();

// test.stop();

// test.restart();