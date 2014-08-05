# ReadMe #

	var NodeCmd = require('node.cmd');
	var svnCmd = new NodeCmd('svn');

## 公共方法 ##

- setCwd(cwd)：
	* 说明： 设置命令运行的路径
	* 参数：
		* cwd：命令行运行的路径
	* 返回值：无
	
- queueExec(args, option, callback, [scope])
	* 说明：按照队列顺序执行命令
	* 参数：
		* args：命令运行的参数
		* options：命令行运行的环境参数
		* callback：命令执行完的回调方法，包含三个参数errors,stdout,stderr
		* scope：回调方法的作用域
	* 返回值：无

- exec(args, option, callback, [scope])：
	* 说明：执行命令
	* 参数：
		* args：命令运行的参数
		* options：命令行运行的环境参数
		* callback：命令执行完的回调方法，包含三个参数errors,stdout,stderr
		* scope：回调方法的作用域
	* 返回值：无

## 代码示例 ##

	var NodeCmd = require('node.cmd');
	
	var svnCmd = new NodeCmd('svn');
	svnCmd.exec(['co','https://svn.*****'],{},function(errors,stdout,stderr){
		if(errors){
			
			console.log(errors);
		}else{
			console.log(stdout);
		}
	});

