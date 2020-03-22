var cheerio=require("cheerio");
var Net=require("./net.js");
class Course{
	constructor(classId,courseid,user){
		this.user=user;
		this.courseid=courseid;
		this.clazzId=classId;
	}
	async getChapters(){
		let data=[];

		let raw=await this.user.net.rawGet(`mycourse/studentstudycourselist?courseId=${this.courseid}&clazzid=${this.clazzId}`);

		let $=cheerio.load(raw);
		let chaps=$(".cells");
		for(let i=0;i<chaps.length;i++){
			let chap=chaps.eq(i);

			let chaptitle=chap.find(".titlewords").text().replace(new RegExp("\t","g"),"").replace(new RegExp(" ","g"),"").replace(new RegExp("\n","g")," ");

			let subchaps=chap.find(".ncells");
			let chapid=chap.find("h3").attr("id");

			//console.log(chapid,chaptitle);
			let obj={id:chapid,title:chaptitle,courseid:this.courseid,subchaps:[]};
			data.push(obj);
			for(let j=0;j<subchaps.length;j++){
				let subchap=subchaps.eq(j);
				let subtitle=subchap.find("a").eq(0).text().replace(new RegExp("\t","g"),"").replace(new RegExp(" ","g"),"").replace(new RegExp("\n","g")," ");
				let idraw=subchap.find("h4").attr("id");
				if(!idraw)continue;

				let subid=idraw.replace("cur","");
				let obj2={id:subid,title:subtitle,courseid:this.courseid,subchaps:[]};
				obj.subchaps.push(obj2);
				
				let subsubchaps=subchap.find(".ncells");

				for(let k=0;k<subsubchaps.length;k++){
					let subsubchap=subsubchaps.eq(k);
					let subsubtitle=subsubchap.find("a").eq(0).text().replace(new RegExp("\t","g"),"").replace(new RegExp(" ","g"),"").replace(new RegExp("\n","g")," ");
					let subsubid=subsubchap.find("h5").attr("id").replace("cur","");

					obj2.subchaps.push({id:subsubid,courseid:this.courseid,title:subsubtitle});
				}

			//	console.log(subid,subtitle);

			}

		}

		//console.log(chaps);
		return data;
	}
	async getVideoJobs(chapid){//获取所有任务点
		let card=await this.user.net.rawGet(`knowledge/cards?clazzid=${this.clazzId}&courseid=${this.courseid}&knowledgeid=${chapid}`);
		//console.log(card,`knowledge/cards?clazzid=${this.clazzId}&courseid=${this.courseid}&knowledgeid=${chapid}`);

		let loc1=card.indexOf("   mArg = ");
		let loc2=card.indexOf(";\n}catch(e){");
		let raw=card.slice(loc1+10,loc2);
		try{
			let jobs=JSON.parse(raw);
			let def=jobs.defaults;
			//console.log(def);
			let videos=[];
			for(let i in jobs.attachments){
				if(jobs.attachments[i].type=="video"){
					let o=jobs.attachments[i];
					o.chapid=chapid;
					o.ruri=def.reportUrl.replace("https://mooc1-1.chaoxing.com/","");

					videos.push(o);
				}
			}
			return videos;
		}catch(e){
			return [];
		}
	}

}

module.exports=Course;