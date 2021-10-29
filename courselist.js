var cheerio = require("cheerio");
var url = require("url");
var qs = require("querystring");

class courselist {
  constructor(user) {
    this.user = user;
  }

  async getList() {
    // let $ = cheerio.load(await this.user.net.get("visit/interaction"));
    // 课程查询接口换了
    let $ = cheerio.load(
      await this.user.net.get("visit/courselistdata", {
        // 此处需要参数,否则返回的是自己教的课
        courseType: 1,
      })
    );
    // let courses = $(".course");
    // console.log($().html());
    let courses = $("#courseList").find(".course");
    let built = [];
    for (let i = 0; i < courses.length; i++) {
      let course = courses.eq(i).find("a");
      let t_url = course.attr("href");
      if (typeof t_url !== "string") {
        continue;
      }
      let target = url.parse(t_url);
      let query = qs.parse(target.query);
      // let title = course.attr("title");
      // 寻找子元素就好了
      let title = course.find("span").attr("title");
      built.push({ courseId: query.courseid, clazzId: query.clazzid, title });
    }
    return built;
  }
}

module.exports = courselist;
