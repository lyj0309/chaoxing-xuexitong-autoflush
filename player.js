var sleep=(t)=>new Promise((y)=>setTimeout(y,t));
var Logger=require("./logger.js");

class Player{
	constructor(classid,user,video,speed){
		this.playing=video;
		this.tick=0;
		this.progress=0;
		this.end=false;
		this.user=user;
		this.logger=new Logger(classid,user);
		this.statusinfo="";
		if(!speed)speed=1.0;//倍速
		this.speed=speed;
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
	getStatusInfo(){
		return this.statusinfo+"\n\n";
	}
	async doTick(){

 		let status=JSON.parse(await this.user.net.rawGet(`ananas/status/${this.playing.objectId}?k=9790&flag=normal&_dc=`+new Date().getTime()));

 		let duration=status.duration;
 		if(duration<60*8) //小于8分钟的完整看完
 			this.speed=1;

		if(this.progress/1000>=duration)
		{	
			this.progress=duration*1000;
			this.end=true;
		}
		let loginfo=await this.logger.sendLog(this.playing.ruri,this.playing.otherInfo,this.playing.chapid,this.playing.jobid,this.playing.objectId,this.progress/1000,status);

		/*try{
			if(JSON.parse(loginfo).isPassed==true);
				this.end=true;
		}catch(e){}*/
		//if(this.tick++%10==0)
		this.statusinfo="正在 "+this.speed.toFixed(1)+" 倍速播放:  "+this.playing.property.name+"  "+((this.progress/1000)/duration*100).toFixed(2)+"% "+((this.progress/1000)+"/"+duration)+"   "+loginfo;
		this.progress+=parseInt(this.speed*5000);

	}
	async eventLoop(){//自动消费播放队列
		while(!this.end){
			try{
				await this.doTick();
			}catch(e){
				console.log(e);
			}
			await sleep(5000);
		}
	}
}


 module.exports=Player;