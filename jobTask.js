var sleep=(t)=>new Promise((y)=>setTimeout(y,t));
var Player=require("./player.js");
var testList=require("./work/testList.js");

class jobTask{
	constructor(classid,chapter,jobs,user,playerspeed,autotest){
		this.user=user;
		this.rawjobs=jobs.concat([]);
		this.jobs=jobs;
		this.taskend=false;
		this.clazzId=classid;
		this.chapter=chapter;
		this.autotest=autotest;

		this.indexes=0;
		this.currentPlayer=undefined;
		this.playerspeed=playerspeed;

		this.workinfo="测验器就绪中...";
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
	getJobProgress(){
		return {current:this.rawjobs.length-this.jobs.length,total:this.rawjobs.length};
	}
	getStatusInfo(){
		if(!this.currentPlayer)return "播放器就绪中...\n\n"+this.workinfo+"\n";
		return this.currentPlayer.getStatusInfo()+"\n"+this.workinfo+"\n";

	}
	async doTick(){
		let job=this.jobs.shift();
		if(!job){this.taskend=true;return;}
		

		await this.handleJob(job);
		
		this.indexes++;
	}
	async handleJob(job){
		switch(job.type){
			case "video"://视频任务
				if(!job.isPassed){
					let player=new Player(this.clazzId,this.user,job,this.playerspeed);
					this.currentPlayer=player;
					await player.wait();
				}		
			break;
			case "workid"://测验
				let list=new testList(this.chapter.courseid,this.chapter.id,this.clazzId,job,this.user);
				let detail=await list.getDetail();
		

			if(detail.status==0){//还没做,尝试自动查答案过测验
			//	console.log("还没做,尝试自动查答案过测验");
			
		//	console.log(this.autotest);
				if(this.autotest){
					let {answers,count}=await list.queryAnswers(detail,0);

				//	console.log(answers)
					if(answers)
						await list.submitTest(detail,answers,detail.params,1);


					let info=`检测到未完成测验,共${detail.set.length}题,从题库查得答案:${count}题`;
					this.workinfo=info;
				}
			}else if(detail.status==2){
				await list.uploadUserAnswers(detail.set);
			}

		
			break;
		}
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



module.exports=jobTask;



