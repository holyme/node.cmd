/*var Cmd = require('../index');
var cmd = new Cmd();
cmd.isSysCmd = true;
cmd.setCwd('c:/');
cmd.exec('dir', function(ret) {
	console.log(ret.stdout.toString('utf8'));
});*/

// var cp = require('child_process');

// cp.exec('npm ls -g', function(error, stdout, stderr) {
// 	console.log(stdout);
// });

/*cp.exec('svn -h', function(error, stdout, stderr) {
	console.log(stdout)
});*/

// cp.exec('node -v',function(error, stdout, stderr) {
// 	console.log(stdout)
// });

// var spawn = cp.spawn('cmd.exe', ['/s', '/c', 'npm', 'ls', '-g']);//ok
// var spawn = cp.spawn('cmd.exe', ['/s', '/c', 'tianma', '-h']);//ok
// var spawn = cp.spawn('node', ['-v']);//ok
// var spawn = cp.spawn('svn', ['-h']);//ok
// var spawn = cp.spawn('git', ['--help']);//ok
// spawn.stdout.on('data', function(data) {
// 	console.log(data.toString());
// });

var Cmd = require('../index');
var ins = new Cmd('npm');
ins.exec('-v', function(data) {
	console.log(data);
});