let cheerio=require("cheerio");
let quesbank=require("../bank/quesbank.js");
let path=require("path");

class TestList{

	constructor(courseid,chapterid,classid,job,user){
		this.job=job;
		this.classid=classid;
		this.courseid=courseid;
		this.chapterid=chapterid;
		this.user=user;
	}
	async getWorkEnt(){
		let raw=await this.user.net.rawGet(`api/work?api=1&workId=${this.job.property.workid}&jobid=${this.job.jobid ? this.job.jobid : ""}&needRedirect=true&knowledgeid=${this.chapterid}&ut=s&clazzId=${this.classid}&type=&enc=${this.job.enc}&courseid=${this.courseid}`)
		let $=cheerio.load(raw);
		return $;
	}
	async getParams($){//获取该测验有关的提交参数
		//let $=await this.getWorkEnt();
		let form=$("#form1");
		
		let courseId=form.find("#courseId").val();
		let classId=form.find("#classId").val();
		let api=form.find("#api").val();
		let workAnswerId=form.find("#workAnswerId").val();
		let totalQuestionNum=form.find("#totalQuestionNum").val();
		let fullScore=form.find("#fullScore").val();
		let knowledgeid=form.find("#knowledgeid").val();
		let oldSchoolId=form.find("#oldSchoolId").val();
		let oldWorkId=form.find("#oldWorkId").val();
		let jobid=form.find("#jobid").val();
		let workRelationId=form.find("#workRelationId").val();
		let enc=form.find("#enc").val();
		let enc_work=form.find("#enc_work").val();
		let userId=form.find("#userId").val();
		
		return {courseId,classId,api,workAnswerId,totalQuestionNum,fullScore,knowledgeid,oldSchoolId,oldWorkId,jobid,workRelationId,enc,enc_work,userId};
	}
	async getDetail(){
//		console.log(this.job);

		/*console.log(`https://mooc1-1.chaoxing.com/api/work?api=1&workId=${this.job.property.workid}&jobid=work-${this.job.property.workid}&needRedirect=true&knowledgeid=${this.chapterid}&ut=s&clazzId=${this.classid}&type=&enc=${this.job.enc}&courseid=${this.courseid}`,raw);
*/		

		let $=await this.getWorkEnt();
		let set=[];
		let status=this.getStatus($);

		let allques=$(".TiMu");
		
//		if(allques.length==0)
//		console.log(allques.length,raw);

if(status==0 || status==2)

		for(let k=0;k<allques.length;k++){
			let ques=allques.eq(k);

			let titlenode=ques.find(".Zy_TItle").eq(0).find(".clearfix").eq(0);
			let title=titlenode.text()
			
			let type=this.getType(ques,title,status);
			
			title=title.replace(new RegExp("\t","g"),"");
			title=title.replace(new RegExp("\n","g"),"");
			title=title.replace(/【.*?】/,"");
			
			let imgs=titlenode.find("img");
			for(let p=0;p<imgs.length;p++){
				//console.log(imgs.eq(p))
				let src=this.handleImageNode(imgs.eq(p));
				title+=src;
			}

			let answerbar=ques.find(".Py_answer");
			
			let hasdone=status==2;

			let built={type,title};

			switch(type){			

				case 1:{
					let answers=answerbar.find("span");
					built.answer="";
					built.options={};
					built.optiontype=0;

					//let hasdone=ques.find(".Zy_ulTop").attr("class").indexOf("w-top")==-1;

					if(hasdone){
						let options=ques.find(".Zy_ulTop").find(".clearfix");
						for(let i=0;i<options.length;i++){
							let optionkey=options.eq(i).find("i").text().replace("、","");
							let optionvalue1=options.eq(i).find("p").text();
							let optionvalue2=options.eq(i).find("a").text();
							let optionvalue3="";

							let imgnode=options.eq(i).find("img");
							if(imgnode.attr("src"))
								optionvalue3=this.handleImageNode(imgnode);

							built.options[optionkey]=optionvalue1 || optionvalue2 || optionvalue3;


						}

						let correct=answerbar.find(".fr");
						//console.log(answerbar.html())
						let iscorrect=correct.attr("class").indexOf("dui")!=-1;
				
						for(let i=0;i<answers.length;i++){
							let answer=answers.eq(i).text();
							let split=answer.indexOf("：");
							let key=answer.substring(0,split);
							let value=answer.substring(split+1,answer.length);
							if(key.indexOf("我的答案")!=-1)
								built.answer=value;
						}
						built.correct=iscorrect;
					}else{
						let options=ques.find(".Zy_ulTop").find("li");

						built.optionid=options.eq(0).find("input").eq(0).attr("name").replace("answer","");

						for(let i=0;i<options.length;i++){
							let option=options.eq(i);
							let optionkey=option.find("input").attr("value");
							let optionvalue=option.find("a").text();
							built.options[optionkey]=optionvalue;
						}

					}

					break;
				};
				case 2:{
					built.answers=[];
					built.optiontype=2;

					let answerkeys=answerbar.find(".font14");
					for(let i=0;i<answerkeys.length;i++)
					{	
						if(answerkeys.eq(i).find(".fr").length==0)
							continue;

						let answer=answerkeys.eq(i).find(".clearfix");
						let content=answer.text();
						
						let iscorrect=answerbar.find(".fr").attr("class").indexOf("dui")!=-1;
						content=content.replace(new RegExp("\t","g"),"");
						content=content.replace(new RegExp("\n","g"),"");
						content=content.replace(/(^\s*)|(\s*$)/g, "");

						built.answers.push({answer:content,correct:iscorrect});
					}
					if(hasdone){
						let correct=true;
						for(let m=0;m<built.answers.length;m++)
							if(!built.answers[m].correct)
								correct=false;
						built.correct=correct;
					}else{
						let fixs=ques.find(".clearfix");


						let ultk=ques.find(".Zy_ulTk").eq(0);
						let inputs=ultk.find("input");
						let lastinput=inputs.eq(inputs.length-1);

						let as=ultk.find("li");
						let optionids=[];
						for(let i=0;i<as.length;i++)
						{
							let name=as.eq(i).find(".inp").eq(0).attr("name");
							if(!name)continue;

							optionids.push(name.replace("answer",""));
						}
						built.optionid=JSON.stringify({id:lastinput.attr("name").replace("tiankongsize",""),subids:optionids});
						//console.log(inputs.length,built.optionid)

					}
					//console.log(built)
					break;
				};
				case 3:{

					built.optiontype=3;
					//let hasdone=ques.find(".Py_tk").eq(0).find(".ri").length<=0;
					if(hasdone){
						let answer=answerbar.find("span");
						let correct=answerbar.find(".fr");
						let iscorrect=correct.attr("class").indexOf("dui")!=-1;
						let answerstr=answer.find(".font20").text();
						
						built.answer=false;
						if(answerstr=="√")
							built.answer=true;

						built.correct=iscorrect;
					}else{
						built.optionid=ques.find(".Py_tk").find("input").eq(0).attr("name");
						built.optionid=built.optionid.replace("answer","").replace("answertype","");
					}
					//built.hasdone=hasdone;
					break;
				};
				case 4:{
					if(hasdone){

					}else{

					}
					break;
				};
				case 5:{
					built.optiontype=1;

					let multilist=ques.find(".Zy_ulTop").eq(0);
					let multi=multilist.find("li");
					built.options=[];
					for(let i=0;i<multi.length;i++)
					{
						let option=multi.eq(i).find("a").text();
						built.options.push(option);
					}
					if(hasdone){

						let answers=answerbar.find("span");

						let correct=answerbar.find(".fr");
						//console.log(answerbar.html())
						let iscorrect=correct.attr("class").indexOf("dui")!=-1;
				
						for(let i=0;i<answers.length;i++){
							let answer=answers.eq(i).text();
							let split=answer.indexOf("：");
							let key=answer.substring(0,split);
							let value=answer.substring(split+1,answer.length);
							if(key.indexOf("我的答案")!=-1)
								built.answer=value;
						}						
						built.correct=iscorrect;
					}else{
						built.optionid=multilist.find("input").eq(0).attr("name").replace("answercheck","");
					}
					break;
				}

			}
			
			//built.hasdone=hasdone;
			set.push(built);
		}
	//	console.log(status,set);
		
		let params={};
		if(status==0)
			params=await this.getParams($);

		return {status,params,set};
	}
	handleImageNode(imgnode){
		let imgsrc=imgnode.attr("src");
//		console.log(imgnode.html())
		if(imgsrc.indexOf("latex")!=-1){//公式
			return "["+imgsrc+"]";
		}else{
			return "["+path.basename(imgsrc)+"]";//图片
		}
	}
	getStatus($){//判断状态：0为待做，1为待批阅 ,2为已完成
		let top=$(".ZyTop").find("h3");
		let statustext=top.find("span").eq(0).text();

		if(statustext.indexOf("待做")!=-1)
			return 0;
		else if(statustext.indexOf("待批阅")!=-1)
			return 1;
		else if(statustext.indexOf("已完成")!=-1)
			return 2;
		else return -1;

	}
	type2optionType(type){
		if(type==1)
			return 0;
		else if(type==2)
			return 2;
		else if(type==3)
			return 3;
		else if(type==4)
			return -1;
		else if(type==5)
			return 1;
	}
	getType(ques,title,status){//1为选择题,2为填空题,3为判断题,4为主观题,5为多选题
		//let type=1;
			/*if(ques.find("questionErrorForm1").attr("id")=="questionErrorForm1")
					type=1;
			
			else if(ques.find(".font14").eq(0).attr("class")=="font14")
			{		
				if(status==2)
					type=4;
				else
					type=2;

			}
			else if(ques.find(".Py_tk").attr("class")=="Py_tk")
			{
				if(ques.find(".Py_tk").eq(0).find(".ri").length>0)
					type=3;
				else
					type=4;

			}
			else if(ques.find(".font20").attr("class")=="font20")
					type=3;
			else if(ques.find(".Zy_ulTk").attr("class")=="Zy_ulTk")
					type=4;*/
			if(title.indexOf("【单选题】")!=-1)
				return 1;
			else if(title.indexOf("【填空题】")!=-1)
				return 2;
			else if(title.indexOf("【判断题】")!=-1)
				return 3;
			else if(title.indexOf("【简答题】")!=-1)
				return 4;
			else if(title.indexOf("【多选题】")!=-1)
				return 5;
			
			else return -1;


	}
	async uploadUserAnswers(detail){
		let bank=new quesbank();
		for(let i in detail){
			if(detail[i].correct)
				await bank.upload(detail[i],this.courseid,this.chapterid,this.classid);
		}

	}
	async queryAnswers(detail,bypass){//第二参数bypass代表,如果查不到的答案的题目数量超过bypass,则直接返回空
		let set=detail.set;

		let bank=new quesbank();
		let answers=await bank.download(set.map((x)=>(x.title)));
//console.log(set.map((x)=>(x.title)),answers);

		let bypasscount=0;
		for(let i in set){
			//有些老师会把题目选项随机调换,
			//但是这个地方是可以通过搜索选项处理的
			//鉴于这情况较少,这里暂时不填坑
			
			if(!answers[i]){bypasscount++;continue;};
			answers[i].optiontype=this.type2optionType(set[i].type);
			answers[i].optionid=set[i].optionid;
			
		}
		if(bypasscount>bypass)return;
		return answers;
	}
	async submitTest(detail,answers,params,submit){//提交测验
		let pyFlag="";
		if(!submit)
			pyFlag="1";

		let built={...params,pyFlag};
		let answerwqbid="";
		for(let i in answers){
 			let optiontype=this.type2optionType(answers[i].type);


			if(answers[i].type==1){
				built["answertype"+answers[i].optionid]=optiontype;
				built["answer"+answers[i].optionid]=answers[i].answer;
	 			answerwqbid+=answers[i].optionid+",";
			}
			else if(answers[i].type==2){
				let {id,subids}=JSON.parse(answers[i].optionid);
				built["answertype"+id]=optiontype;
				built["tiankongsize"+id]=subids.length+"";
				
				for(let j in answers[i].answers){
					built["answer"+subids[j]]=answers[i].answers[j].answer;
					built["answerEditor"+subids[j]]="";
					built["flag"+subids[j]]=subids[j];
					

				}
	 			answerwqbid+=id+",";	

			}
			else if(answers[i].type==3){
				built["answertype"+answers[i].optionid]=optiontype;

				built["answer"+answers[i].optionid]=answers[i].answer?"true":"false";
	 			answerwqbid+=answers[i].optionid+",";
			}
			else if(answers[i].type==5){
				built["answertype"+answers[i].optionid]=optiontype;
				built["answer"+answers[i].optionid]=answers[i].answer;
	 			answerwqbid+=answers[i].optionid+",";
			}
		}
		built.answerwqbid=answerwqbid;

	//console.log(built);

		return this.user.net.post(`work/addStudentWorkNew?_classId=${params.classId}&courseid=${params.courseId}&token=${params.enc_work}&totalQuestionNum=${params.totalQuestionNum}&ua=pc&formType=post&saveStatus=1&version=1`,built);
	}

}

module.exports=TestList;