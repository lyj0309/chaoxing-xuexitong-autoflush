/*
题库是一个人人为我，我为人人的分享P2P机制

*/
let Net = require("../net.js");

class QuesBank {
  constructor() {
    this.net = new Net("http://quesbank.math.cat:6060/");
  }
  async upload(ques, courseid, chapterid, classid) {
    //console.log(ques,courseid,chapterid,classid)
    let topost = {
      ques: Buffer.from(
        JSON.stringify({
          courseid,
          chapterid,
          classid,
          ...ques,
        })
      ).toString("base64"),
    };
    try {
      return await this.net.post("bank/uploadBase64", topost);
    } catch (e) {
      //console.log(e,topost);
      //process.exit();
      return;
    }
  }
  async download(titles) {
    //		console.log("downloading",titles)
    //let target=Object.assign(titles,{});
    //	target=target.map((x)=>(x.title));
    //		console.log(target);
    let raw = await this.net.post("bank/downloadBase64", {
      titles: Buffer.from(JSON.stringify(titles)).toString("base64"),
    });
    try {
      return JSON.parse(raw);
    } catch (e) {
      //console.log("错误发生",titles,raw,e);
      //process.exit();
      return [];
    }
  }
}

module.exports = QuesBank;
