let fs=require("fs");
let open=require("open");
let prompt=require("prompts");
let cheerio=require("cheerio");
let Net=require("./net.js");

class Loginer{//登录器
	constructor(){
		this.net=new Net("http://www.xuexi365.com/");
		this.imgurl=__dirname+"/verifycode.png";
	//	this.login();
	}
	async login(){//设置各种引导,最终返回登录Cookie
		
		while(true){
			let acc={};
			acc=await prompt([
					{type:"text",name:"uname",message:"请输入超星账户手机号"},
					{type:"text",name:"password",message:"请输入账户密码"},
				])
				if(!acc.uname || !acc.password)//填空代表退出登录
					throw "输入为空,退出程序"
		
			let vercode=await this.getNumcode();
			try{
			await this.doLogin(acc.uname,acc.password,vercode);
			break;
			}catch(e){
			console.log(`登录失败: ${e},请重试!\n\n`);

			}
		}

		//这里处理Cookie，保留重要的部分

		let cks=await this.net.getCookies();
		return cks;
	}
	async getNumcode(){
		let img=await this.net.getBin("num/code",true);
		fs.writeFileSync(this.imgurl,img);
		open(this.imgurl);
		let ret=await prompt({type:"text",name:"vercode",message:"已弹出验证码,请在这输入验证码"});
		return ret["vercode"];
	}
	async doLogin(uname,password,numcode){//返回成功或失败
		//cookie中有三个关键值特别重要
		//_uid、_d、vc3
		
		let info=await this.net.post("cxlogin?refer=http%3A%2F%2Fi.mooc.chaoxing.com",{
			refer_0x001:"http%3A%2F%2Fi.mooc.chaoxing.com",
			pid:-1,
			pidName:"",
			fid:9136,
			fidName:"超星个人网",
			allowJoin:1,
			isCheckNumCode:1,
			f:0,
			uname,
			password,
			numcode
		},true);
		let ck=await this.net.getCookies();
		//console.log(ck,info);
		if(ck.indexOf("userinfo")!=-1)
			return;
		else{
			let $=cheerio.load(info);
			let error=$("#show_error").text();
			//console.log("error",error);
			throw error;
		}
	}
}



module.exports=Loginer;