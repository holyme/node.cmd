var exec = require('child_process').exec,
	/**
	* ����ϲ�����
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
	* �ඨ��
	*/
	Cmd=function(name,cwd){
		this.name=name;
		this.cwd=cwd;
	};
	
	/**
	* ������չ
	*/
	apply(Cmd.prototype,{
		name:undefined,			//��������
		cwd:undefined,			//���ǰ����·��	
		/**
		* ִ������
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
		* ��ȡcmd������ַ���
		* @param params �������еĲ���
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
		* ִ����һ������
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
		* ��ʼִ������
		*/
		run : function () {
			if (!CMD.isRunning) {
				CMD.isRunning = true;
				CMD.doNext();
			}
		},
		/**
		* ִ��
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
