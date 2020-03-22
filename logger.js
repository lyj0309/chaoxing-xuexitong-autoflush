var Net=require("./net.js");

 class Logger{
 	constructor(classid,user){
 		this.user=user;
 		this.clazzId=classid;
 	}
 	async sendLog(ruri,otherInfo,chapterId,jobid,objectId,current,status){
 		//let otherInfo="nodeId_"+chapterId+"-cpi_82274641";

		//console.log(status)
 		let duration=status.duration;
 		let dtoken=status.dtoken;


 		let enc=this.encode(jobid,objectId,current,duration);
 		let reportUrl=`${ruri}/${dtoken}?clazzId=${this.clazzId}&playingTime=${current}&duration=${duration}&clipTime=0_${duration}&objectId=${objectId}&otherInfo=${otherInfo}&jobid=${jobid}&userid=${this.user.userid}&isdrag=0&view=pc&enc=${enc}&rt=0.9&dtype=Video&_t=`+new Date().getTime();

 		//console.log(reportUrl)
// 		console.log(this.user.net.getCookies());
 		return await this.user.net.rawGet(reportUrl);
 	}
 	encode(jobid,objectId,current,duration){//学习通加密算法
 		//MD5([clazzId][userid][jobid][objectId][currentMs][d_yHJ!$pdA~5][durationMs][clipTime])
 		//clazzId=班级id
 		//userid=用户id
 		//jobid=任务点id
 		//objectId=资源id
 		//currentMs=当前看到的进度位置,单位毫秒
 		//d_yHJ!$pdA~5=magicCode=固定码
 		//durationMs=总时长,单位毫秒
 		//clipTime=0_duration
 		
 		let clipTime="0_"+duration;
 		let built=`[${this.clazzId}][${this.user.userid}][${jobid}][${objectId}][${current*1000}][d_yHJ!$pdA~5][${duration*1000}][${clipTime}]`;

 		let enc=require("crypto").createHash("md5").update(built).digest("hex");
 		return enc;
 	}
 }
/*
let net=new Net("https://mooc1-1.chaoxing.com/");

let logger=new Logger({
 	userid:"94374572",
 	clazzId:"13610019",
 	net
 });
logger.sendLog("1566395970781740","8a44bf2eb4907915f771f2d82055bd30",289).then(console.log);
*/
//.encode("1566395970781740","8a44bf2eb4907915f771f2d82055bd30","404","803"))



module.exports=Logger;