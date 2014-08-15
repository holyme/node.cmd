# ReadMe #

执行Cmd命令行的封装

## 代码示例 ##

	var NodeCmd = require('node.cmd');

	var npmCmd = new NodeCmd('npm');
	npmCmd.exec('-v', function(data) {
		console.log(data);
	});

## 公共方法 ##

- setCwd(cwd)：
	* 说明： 设置命令运行的路径
	* 参数：
		* cwd：命令行运行的路径
	* 返回值：无
	
- queueExec(args, [option], callback)
	* 说明：按照队列顺序执行命令
	* 参数：
		* args：命令运行的参数
		* options：命令行运行的环境参数，该参数可以不传
		* callback：命令执行完的回调方法，参数为：{errors:null,stdout:'',stderr:''}
	* 返回值：无

- exec(args, [option], callback)：
	* 说明：执行命令
	* 参数：
		* args：命令运行的参数
		* options：命令行运行的环境参数，该参数可以不传
		* callback：命令执行完的回调方法，包含三个参数errors,stdout,stderr
	* 返回值：无

## 全局属性 ##

NodeCmd.isDebug：命令执行完后输出完整命令
