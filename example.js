var Cmd=require('../index');

var _cmd=new Cmd('dir','d:/workspace/');

_cmd.exec(function(error,stdout,stdeer){
	console.log('stdout:'+stdout);
	console.log('stderr:'+stdeer);
	
	if(error){
		console.lg('error:'+error);
	}
});