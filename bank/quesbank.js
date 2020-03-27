/*
题库是一个人人为我，我为人人的分享P2P机制

*/
let Net=require("../net.js");

class QuesBank{
	constructor(){
		this.net=new Net("http://127.0.0.1:6060/");
	}
	upload(ques,courseid,chapterid,classid){
		//console.log(ques,courseid,chapterid,classid)
		return this.net.post("bank/upload",{
			ques:JSON.stringify({
				courseid,
				chapterid,
				classid,
				...ques				
			})
		})
	}
	async download(titles){
//		console.log("downloading",titles)
		//let target=Object.assign(titles,{});
	//	target=target.map((x)=>(x.title));
//		console.log(target);
		let raw=await this.net.post("bank/download",{
			titles:JSON.stringify(titles)
		});
		try{
			return JSON.parse(raw);	
		}catch(e){
			//console.log("错误发生",titles,raw,e);
			//process.exit();
			return [];
		}
	}
}


module.exports=QuesBank;
