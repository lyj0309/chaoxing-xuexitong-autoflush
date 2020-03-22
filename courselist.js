var cheerio=require("cheerio");
var url=require("url");
var qs=require("querystring");

class courselist{
	constructor(user){
		this.user=user;
	}
	async getList(){
		let $=cheerio.load(await this.user.net.get("visit/interaction"));
		let courses=$(".Mconright");
		let built=[];
		for(let i=0;i<courses.length;i++){
			let course=courses.eq(i).find("a");
			let target=url.parse(course.attr("href"));
			let query=qs.parse(target.query);
			let title=course.attr("title");
			built.push({courseId:query.courseId,clazzId:query.clazzid,title});
		}
		return built;
	}
}


module.exports=courselist;