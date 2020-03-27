var sleep=(t)=>new Promise((y)=>setTimeout(y,t));
let Course=require("./course.js");
let jobTask=require("./jobTask.js")

function reduceTree(tree,lvl){
	if(!lvl)lvl=0;

	let ret=[];	
	for(let i in tree)
	{
		ret.push({id:tree[i].id,title:tree[i].title,courseid:tree[i].courseid,lvl});
		if(tree[i].subchaps && tree[i].subchaps.length>0)
			ret=ret.concat(reduceTree(tree[i].subchaps,lvl+1));
	}
	return ret;
}
class chapterTask{
	constructor(classid,chapters,user,playerspeed){
		
		let red=reduceTree(chapters);

		this.rawchapters=red.concat([]);
		this.chapters=red;
		this.user=user;
		this.taskend=false;
		this.clazzId=classid;
	
		this.current=undefined;
		this.current_task=undefined;
		this.playerspeed=playerspeed;

		this.eventLoop();
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
	getGUI(){
		if(!this.current)return [];

		let built=[];
		//built.push("\n\n\n\n\n\n\n\n\n\n");
		built.push("\n");
		let focus=-1;
		for(let i in this.rawchapters){
			let iscurrent=this.rawchapters[i].id==this.current.id;
			if(iscurrent)focus=i;
			built.push("      ".repeat(this.rawchapters[i].lvl)+this.rawchapters[i].title+" "+(iscurrent?"  <-  ":"")+" "+(this.rawchapters[i].tipinfo || ""));
		}
		let offset=10;
		let start=parseInt(focus)-offset>0?(parseInt(focus)-offset):0;
		let end=parseInt(focus)+offset>built.length-1?(built.length-1):(parseInt(focus)+offset);
		
		let rebuilt=[];

		for(let i in built){
			if(parseInt(i)>start && parseInt(i)<end)
				rebuilt.push(built[i]);
		}
		rebuilt.unshift(this.getStatusInfo());
		
	//	this.refreshTipInfo();
		return rebuilt;	
	}
	refreshTipInfo(){
		if(!this.current_task)return;

		let jobprogress=this.current_task.getJobProgress();
		let tipinfo=`(${jobprogress.current}/${jobprogress.total})`;
		this.rawchapters.find((x)=>(x.id==this.current.id)).tipinfo=tipinfo;
		return tipinfo;
	}
	getStatusInfo(){
		if(!this.current || ! this.current_task)return "就绪中...";

		return "   进行中的章节 -> "+this.current.title+"\n\n"+
		this.current_task.getStatusInfo();
	}
	async studyChapter(chapter){
		return this.user.net.post("mycourse/studentstudyAjax",{
			courseId:chapter.courseid,
			clazzid:this.clazzId,
			chapterId:chapter.id,
			cpi:0,
			verificationcode:""
		})

	}
	async doTick(){
		let chapter=this.chapters.shift();
		this.current=chapter;
		if(!chapter){this.taskend=true;return;}

		await this.studyChapter(chapter);

		let course=new Course(this.clazzId,chapter.courseid,this.user);
		let jobs=await course.getJobs(chapter.id);
		let task=new jobTask(this.clazzId,chapter,jobs,this.user,this.playerspeed);
		this.current_task=task;

		this.refreshTipInfo();
		await task.wait();
		this.refreshTipInfo();

	}
	async eventLoop(){
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

module.exports=chapterTask;

/*
var Net=require("./net.js");
let net=new Net("https://mooc1-1.chaoxing.com/");
net.setCookie(``);
let courselist=require("./courselist.js");

(async()=>{
let user={
 	userid:"94374572",
 	net
 };

let classid="13132734";
let courseid="206211149";

let cs=new Course(classid,courseid,user);
let cps=await cs.getChapters();
console.log(cps);
//new chapterTask(classid,cps,user);

console.log(await (new courselist(user)).getList());

})();
*/
