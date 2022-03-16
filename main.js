console.log("版权声明:");
console.log("作者: Wyatt Zheng");
console.log("邮箱: yuxon@qq.com");
console.log("\n");
console.log("本作品仅提供学习及研究程序原理用途\n\n");

const fs = require("fs");
let Loginer = require("./loginer.js");
let task = require("./courseTask.js");
let prompt = require("prompts");
let coursepicker = require("./coursepicker.js");
let Net = require("./net.js");
let Config = require("./config.js");

async function getUser(cookie) {
	let domain = "https://mooc1-1.chaoxing.com/";
	let net = new Net(domain);
	await net.setCookie(cookie);
	let userid = Net.parseCookies(cookie)["_uid"];

	let user = {
		userid: userid,
		cookie,
		net,
	};
	return user;
}

async function start() {
	let config = await new Config("./config.json").read();
	let cookie;
	// if (config.saveCookie) {
	// 	// 尝试读取 cookie.txt 来使用
	// 	if (fs.existsSync("./cookie.txt")) {
	// 		cookie = fs.readFileSync("./cookie.txt");
	// 	} else {
	// 		// 没找到 cookie.txt 尝试登陆并保存
	// 		console.log("没有已经保存的Cookie 将登陆获取一个");
	// 		cookie = await new Loginer().login(config);
	// 		fs.writeFileSync("./cookie.txt", cookie.toString());
	// 	}
	// } else {
	// 	// 没有开启 Cookie 保存,那就每次都登陆
	// 	cookie = await new Loginer().login(config);
	// }
	cookie = await new Loginer().login(config);
	let user = await getUser(cookie);

	// console.log(cookie);
	console.log("\n");

	if (!config.speed) {
		Object.assign(
			config,
			await prompt({
				type: "number",
				name: "speed",
				message: "请输入视频刷课速率(不填默认为2)",
			})
		);
	}
	if (!config.speed) config.speed = 2.0;

	let picker = new coursepicker(user);
	let courses = await picker.pick(config);

	if (!courses.length) {
		console.log("似乎没有课程可用, 程序已退出");
		return;
	}

	console.log("\n");

	if (!config.test) {
		Object.assign(
			config,
			await prompt({
				type: "text",
				name: "test",
				message: "默认自动过测验,若需要关闭该功能请填写 no 并回车",
			})
		);
	}
	let autotest = config.test == "no" ? false : true;

	//	console.log(courses);
	new task(courses, user, config.speed, config.autotest);
}
async function debug(cookie) {
	let user = await getUser(cookie);
	let speed = 16.0;

	let picker = new coursepicker(user);
	await picker.getAllCourses();
	new task(picker.list.slice(6), user, speed);
}

exports.main_handler = async (event, context) => {
    console.log("Hello World")
    console.log(event)
    console.log(event["non-exist"])
    console.log(context)
    return event
};

start().catch(console.log);
