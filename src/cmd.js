var exec = require('child_process').exec,
	/**
	* 对象合并方法
	*/
	apply=function(obj){
		if(arguments.length<2){
			return obj;
		}
		for(var i=1;i<arguments.length;i++){
			var _source=arguments[i];
			for(var key in _source){
				obj[key]=_source[key];
			}
		}
		return obj;
	},
	
	/**
	* 类定义
	*/
	Cmd=function(name,cwd){
		this.name=name;
		this.cwd=cwd;
	};
	
	/**
	* 方法扩展
	*/
	apply(Cmd.prototype,{
		name:undefined,			//命令名称
		cwd:undefined,			//命令当前运行路径	
		/**
		* 执行命令
		*/
		exec:function(params,callback){
			if(arguments.length==1&&typeof(params)=='function'){
				callback=params;
				params=null;
			}
		
			var _cmdStr=CMD.getCmdString(this.name,params);
			
			var option={};
			if(this.cwd){
				option.cwd=this.cwd;
			}
			CMD.exec(_cmdStr,option,callback);
		}
	});

	CMD={
		isRunning : false,	
		list : [],
		/**
		* 获取cmd命令的字符串
		* @param params 给命令行的参数
		*/
		getCmdString:function(name,params){
			var _cmd=[name];
			if(params){
				for(var key in params){
					var val=params[key];
					_cmd.push(key);
					if(val){
						_cmd.push(val);
					}
					_cmd.push(params[key]);
				}
			}
			_cmd=_cmd.join('');
			console.log(_cmd);
			return _cmd;
		},
		/**
		* 执行下一条命令
		*/
		doNext : function () {
			var _cmd = CMD.list.shift();
			if (_cmd) {
				exec(_cmd.cmd, _cmd.option, (function () {
						this.callback.apply(this, arguments);

						CMD.doNext();
					}).bind(_cmd));
			} else {
				CMD.isRunning = false;
			}
		},
		/**
		* 开始执行命令
		*/
		run : function () {
			if (!CMD.isRunning) {
				CMD.isRunning = true;
				CMD.doNext();
			}
		},
		/**
		* 执行
		*/
		exec : function (cmd, option, callback) {
			CMD.list.push({
				cmd : cmd,
				option : option,
				callback : callback
			});

			CMD.run();
		}
	};

module.exports = Cmd;
