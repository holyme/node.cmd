var Cmd = require('../index');


var SvnCmd = Cmd.extend({
	name: 'svn',
	co: function(path) {
		this.exec(['co', path], function(ret) {
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


var test = new SvnCmd('d:/temp/');

test.co('https://github.com/xshong2008/cheerwejs');