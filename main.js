console.log("版权声明:");
console.log("作者: Wyatt Zheng");
console.log("邮箱: yuxon@qq.com");
console.log("\n");
console.log("本作品仅提供学习及研究程序原理用途\n\n");



let Loginer=require("./loginer.js");
let task=require("./courseTask.js");
let prompt=require("prompts");
let coursepicker=require("./coursepicker.js");
let Net=require("./net.js");

async function getUser(cookie){
	let domain="https://mooc1-1.chaoxing.com/";
	let net=new Net(domain);
	await net.setCookie(cookie);
	let userid=Net.parseCookies(cookie)["_uid"];

	let user={
		userid:userid,
		cookie,
		net
	}
	return user;
}
async function start(){
	let cookie=await (new Loginer().login());
	
	let user=await getUser(cookie);
	//console.log(cookie);
	console.log("\n");

	let {speed}=await prompt({type:"number",name:"speed",message:"请输入视频刷课速率(不填默认为2)"});
	if(!speed)speed=2.0;

	let picker=new coursepicker(user);
	let courses=await picker.pick();

	if(!courses.length) {
		console.log("似乎没有课程可用, 程序已退出");
		return;
	}

	console.log("\n");

	let {test}=await prompt({type:"text",name:"test",message:"默认自动过测验,若需要关闭该功能请填写 no 并回车"})
	let autotest=test=="no"?false:true;

//	console.log(courses);

	new task(courses,user,speed,autotest);

}
async function debug(cookie){

	let user=await getUser(cookie);
	let speed=16.0;

	let picker=new coursepicker(user);
	await picker.getAllCourses();
	new task(picker.list.slice(6),user,speed);
}


start().catch(console.log);

