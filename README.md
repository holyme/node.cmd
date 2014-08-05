# ReadMe

'
var NodeCmd = require('node.cmd');
var svnCmd = new NodeCmd('svn');
'

公共方法
* setCwd(cwd)：设置命令运行的路径
* queueExec(args, option, callback, scope)：按照队列顺序执行命令
* execxec(args, option, callback, scope)：按照队列顺序执行命令
##

var Cmd = require('node.cmd');
var git = new Cmd('git', 'path/to/bin');
git.exec('list', {
	'l': 5
}, function(data) {
	// ...
});