var Cmd=require('../index');


var TianmaCmd=Cmd.extend({
	name:'tianma',
	start:function(){
		this.exec('start',function(error,stdout,stderr){
			console.log(stdout);
		});
	},
	restart:function(){
		this.exec('restart',function(error,stdout,stderr){
			console.log(stdout);
		});
	},
	stop:function(){
		this.exec('stop',function(error,stdout,stderr){
			console.log(stdout);
		});
	}
});


var test=new TianmaCmd('d:/workspace/tianma/work/');

test.start();

// test.stop();

// test.restart();