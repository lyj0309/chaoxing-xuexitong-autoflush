console.log("版权声明:");
console.log("作者: Wyatt Zheng");
console.log("邮箱: yuxon@qq.com");
console.log("\n");
console.log("本作品仅提供学习及研究程序原理用途\n\n");



let Loginer=require("./loginer.js");
let task=require("./courseTask.js");
let prompt=require("prompts");


new Loginer().login().then(async(ck)=>{
//	console.log(ck)
	let {speed}=await prompt({type:"number",name:"speed",message:"请输入刷课速率(不填默认为2)"});
	if(!speed)speed=2.0;

	new task(ck,speed);
}).catch((e)=>{
	console.log(e);
});


