var sleep=(t)=>new Promise((y)=>setTimeout(y,t));
var Net=require("./net.js");
var CourseList=require("./courselist.js");
var chapterTask=require("./chapterTask.js");
var Course=require("./course.js");


class courseTask{
	constructor(cookie,speed){
		this.taskend=false;
		this.domain="https://mooc1-1.chaoxing.com/";
		this.cookie=cookie;
		this.speed=speed;
		this.current=undefined;
		setInterval(()=>{
			this.drawGUI();
		},1000)
		this.eventLoop();
	}
	async init(){
		this.net=new Net(this.domain);
		await this.net.setCookie(this.cookie);
		this.userid=Net.parseCookies(this.cookie)["_uid"];

		this.user={
			userid:this.userid,
			cookie:this.cookie,
			net:this.net
		}
		this.courses=[];
		await this.fillCourses();	
	}
	async drawGUI(){
		if(!this.current)return;
		let minheight=30;

		let lines=this.current.getGUI();
		lines.unshift("当前课程:"+(this.current_course?this.current_course.title:"无")+" 下一个课程:"+this.courses[0].title+"\n");

		if(lines.length<minheight)
			for(let i=0;i<minheight-lines.length;i++)
				lines.push("");

		for(let i in lines)
			console.log(lines[i]);

	}
	async fillCourses(){
		let list=await new CourseList(this.user).getList();
		this.courses=list;
	//	this.courses.shift();
	}
	async doTick(){
		let course=this.courses.shift();
		if(!course){this.taskend=true;return;}

		let cs=new Course(course.clazzId,course.courseId,this.user);

		let cps=await cs.getChapters();
//		console.log(course,cps);

		let task=new chapterTask(course.clazzId,cps,this.user,this.speed);
		this.current_course=course;
		this.current=task;
		await task.wait();
	}
	async wait(timeout){
		let tick=0;
		if(!timeout)timeout=9999999;
		while(true){
			if(this.taskend)
				return;

			if(tick++>timeout)return;
			await sleep(500);
		}
	}

	async eventLoop(){
		await this.init();
		while(!this.taskend){
			try{
				await this.doTick();
			}catch(e){
				console.log(e);
			}			
			await sleep(1000);
		}
	}

}



module.exports=courseTask;
