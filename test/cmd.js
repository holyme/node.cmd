var Cmd=require('../index');

var _cmd=new Cmd('dir','d:/workspace/');

_cmd.queryExec(function(error,stdout,stdeer){
	console.log('stdout:'+stdout);
	console.log('stderr:'+stdeer);
	
	if(error){
		console.lg('error:'+error);
	}
});
/*
cmd.exec('dir',{
	// cwd:'d:/workspace/'
},function(error,stdout,stdeer){
	console.log('stdout:'+stdout);
	console.log('stderr:'+stdeer);
	
	if(error){
		console.lg('error:'+error);
	}
});
*/