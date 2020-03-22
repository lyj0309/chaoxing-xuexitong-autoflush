var sleep=(t)=>new Promise((y)=>setTimeout(y,t));
var Player=require("./player.js");

class jobTask{
	constructor(classid,jobs,user,playerspeed){
		this.user=user;
		this.rawjobs=jobs.concat([]);
		this.jobs=jobs;
		this.taskend=false;
		this.clazzId=classid;
		this.index=0;
		this.currentPlayer=undefined;
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
	getJobProgress(){
		return {current:this.index,total:this.rawjobs.length};
	}
	getStatusInfo(){
		if(!this.currentPlayer)return "播放器就绪中...\n\n";
		return this.currentPlayer.getStatusInfo();

	}
	async doTick(){
		let job=this.jobs.shift();
		if(!job){this.taskend=true;return;}
		

		if(!job.isPassed){

			let player=new Player(this.clazzId,this.user,job,this.playerspeed);
			this.currentPlayer=player;

			await player.wait();
		}
		this.index++;
	}
	async eventLoop(){
		while(!this.taskend){
			await this.doTick();
			await sleep(1000);
		}
	}
}



module.exports=jobTask;



