var sleep=(t)=>new Promise((y)=>setTimeout(y,t));
var Logger=require("./logger.js");

class Player{
	constructor(classid,user,video,speed){
		this.playing=video;
		this.progress=0;
		this.end=false;
		this.user=user;
		this.logger=new Logger(classid,user);
		this.statusinfo="";
		if(!speed)speed=1.0;//倍速
		this.speed=speed;

		this.reportTimeInterval=60*1000;
		this.tick=this.reportTimeInterval;//确保视频刚开始report一次

		this.simspeed=5*1000;//更新速度;
		this.eventLoop();
	}
	async wait(timeout){
		let tick=0;
		if(!timeout)timeout=9999999;
		while(true){
			if(this.end)
				return;

			if(tick++>timeout)return;
			await sleep(500);
		}

	}
	async init(){

	}
	getStatusInfo(){
		return this.statusinfo+"\n\n";
	}
	async doLog(status,isDrag){
		return await this.logger.sendLog(this.playing.ruri,this.playing.otherInfo,this.playing.chapid,this.playing.jobid,this.playing.objectId,parseInt(this.progress/1000),status,isDrag);
	}
	async doTick(){

 		let status=JSON.parse(await this.user.net.rawGet(`ananas/status/${this.playing.objectId}?k=9790&flag=normal&_dc=`+new Date().getTime()));

 		let duration=status.duration;
// 		if(duration<60*6) //小于6分钟的完整看完
// 			this.speed=1;
		//当视频失效时，duration为空
		if(!duration) {
			console.log(`\n${this.playing.property.name} <- 该视频无法解析, 已跳过\n`);
			this.end = true;
			return;
		}

		let loginfo=`下次报告: ${(this.reportTimeInterval - this.tick)/1000}s`;

		let reportinfo="";
		if(this.progress/1000>=duration)
		{	
			this.progress=duration*1000;
			this.end=true;
			reportinfo=await this.doLog(status,4);
			loginfo=reportinfo;
		}
		if(this.tick>=this.reportTimeInterval){//时间达到需要log的时刻,sendLog一次
			this.tick=0;
			reportinfo=await this.doLog(status,0);
			loginfo=reportinfo;
		}
		try{
			if(JSON.parse(reportinfo).isPassed==true)
				this.end=true;
		}catch(e){}

		//if(this.tick++%10==0)
		this.statusinfo="正在 "+this.speed.toFixed(1)+" 倍速播放:  "+this.playing.property.name+"  "+((this.progress/1000)/duration*100).toFixed(2)+"% "+((this.progress/1000)+"/"+duration)+"   "+loginfo;
		this.progress+=parseInt(this.speed*this.simspeed);

	}
	async eventLoop(){//自动消费播放队列
		while(!this.end){
			try{
				await this.doTick();
				this.tick+=this.simspeed;
			}catch(e){
				console.log(e);
			}
			await sleep(this.simspeed);
		}
	}
}


 module.exports=Player;
