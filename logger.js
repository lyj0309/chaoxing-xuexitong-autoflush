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
net.setCookie(`k8s-ed=de0b05c961e687efb2a13fbaaf9df76e8b82991b; jrose=D561DBD2E1995B0EEE71A17BA28CFDF3.html-editor-a-354395006-p55ww; k8s=687eb943512f20137eb59fcbb50527f27ea3867f; route=3cfd8ee391150acbf63626fecc6e7627; fanyamoocs=11401F839C536D9E; isfyportal=1; uname=182701109; lv=2; fid=9790; _uid=94374572; uf=14b6b1b3f40d8f90d5cd77328d409813c510faa076dcb7366cf36d3a947e6f876ae2b6b4ac88c1df9e2980cb4f71e369c49d67c0c30ca5047c5a963e85f11099879ce5d96904ea5cfd68be96b6183b1a95e54a2d0e600ba125e639d0913ae4988ac7ed57571065dd; _d=1584808139764; UID=94374572; vc=9A372D12DA016FAD473B5BD21FFF8EB1; vc2=1557636DBFB3CAA4E09B4DDB0A62326C; vc3=MVw5RKf38ECuyum7fkB%2BRVNx2ujREh3zoiVY%2BqfiiqRp5UweyEKwql%2FiU8bdf4bfw3AHGXKhSkATG2EJI%2BTkIx5ws%2BJ5AcbFEeSstyJVP4EFGTqYW1U8Dr8V7ahJKJ2TrXWxX3NlezWwQBBlt4m8DhItPLqLLM9IhtFnxPwSRP4%3D8208c287d7a7e73f612d829c6120b4a8; xxtenc=dbc7b0c363265a8c2ad753300e79d734; DSSTASH_LOG=C_38-UN_9207-US_94374572-T_1584808139765; source=""; thirdRegist=0; tl=1; resolution=360; jrose=1C434BF5DBF4F261D4120D6701733B6B.mooc-2999027549-0339b; videojs_id=5394098`);

let logger=new Logger({
 	userid:"94374572",
 	clazzId:"13610019",
 	net
 });
logger.sendLog("1566395970781740","8a44bf2eb4907915f771f2d82055bd30",289).then(console.log);
*/
//.encode("1566395970781740","8a44bf2eb4907915f771f2d82055bd30","404","803"))



module.exports=Logger;