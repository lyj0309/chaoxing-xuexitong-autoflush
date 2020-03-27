var sleep=(t)=>new Promise((y)=>setTimeout(y,t));
var Net=require("./net.js");
var chapterTask=require("./chapterTask.js");
var Course=require("./course.js");
var {LiveContainer,LiveArea}=require("clui-live");

class courseTask{
	constructor(courses,user,speed,autotest){
		this.taskend=false;
		this.user=user;
		this.speed=speed;
		this.current=undefined;
		this.courses=courses;
		this.autotest=autotest;

		setInterval(()=>{
			this.drawGUI();
		},1000);		
		this.eventLoop();

	}
	async init(){

		console.log("\n".repeat(30));//清屏

		this.gui=new LiveContainer();
		this.gui_area=this.gui.createLiveArea();
	
	}
	async drawGUI(){
		if(!this.current)return;

		let nextcourse=this.courses[0];

		let minheight=30;

		let lines=this.current.getGUI();
		lines.unshift("当前课程:"+(this.current_course?this.current_course.title:"无")+" 下一个课程:"+(nextcourse?nextcourse.title:"无")+"\n");

		if(lines.length<minheight)
			for(let i=0;i<minheight-lines.length;i++)
				lines.push("");

		//for(let i in lines)
	//		this.gui_area.write(lines.join("\n"));
			console.log(lines.join("\n"));

	}
	async doTick(){
		let course=this.courses.shift();
		if(!course){this.taskend=true;return;}

		let cs=new Course(course.clazzId,course.courseId,this.user);

		let cps=await cs.getChapters();
//		console.log(course,cps);

		let task=new chapterTask(course.clazzId,cps,this.user,this.speed,this.autotest);
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
