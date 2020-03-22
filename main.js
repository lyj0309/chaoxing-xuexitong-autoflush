console.log("版权声明:");
console.log("作者: Wyatt Zheng");
console.log("邮箱: yuxon@qq.com");
console.log("\n");
console.log("本作品仅提供学习及研究程序原理用途\n\n");



let Loginer=require("./loginer.js");
let task=require("./courseTask.js");

let speed=4.0; //刷课速率配置

new Loginer().login().then((ck)=>{
	new task(ck,speed);
}).catch((e)=>{
	console.log(e);
});


