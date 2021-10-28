# 超星学习通全自动刷课程序

**更新日期: 2021-10-28**

---

2020-5-21 更新内容:  
添加了一个登录接口使得无验证码登录变得可能但是当新接口失效时会回退至上版本接口以保证程序可用性

增加了 config.json 文件，通过 config 文件可以实现无交互登录以及筛选需要刷的课程, 该文件不存在时程序会以默认方式运行  
使用方法:  
在程序根目录下增加 config.json 文件, 并按照以下形式进行编写

```
{
	"uname": string, //手机号
	"password": string, //密码
	// 如果上面两个字段任何一个不存在程序都会让你输入一次完整的账号密码, 只有这两个是必要字段

	"speed": number, // 刷课速度 默认为 2
	"test": boolean, // 是否过测试 默认为true
	"pick": boolean, // 是否通过配置文件进行课程配置 默认为false
	// 以上默认值都之会在config.json读取成功且没有该字段时生效, 如果config.json不存在则全部由键盘输入
	// 当pick为true时且pickinfos字段不存在, 程序只会记录所有课程并写入pickinfos然后结束, pickinfos字段存在时程序会读取pickinfos并跳过所有picked为false的课程

	"pickinfos": {

	}
	// 该字段由程序生成请勿手动编写, 只需要调整该字段内picked值即可
	// 重新获取课程请删除该字段而不仅是值

}
```
---

声明: 本程序仅供学习研究程序工程原理

![desc1](https://raw.githubusercontent.com/ZhyMc/chaoxing-xuexitong-autoflush/master/imgs/chaoxing1.png)
![desc2](https://raw.githubusercontent.com/ZhyMc/chaoxing-xuexitong-autoflush/master/imgs/chaoxing3.png)
![desc3](https://raw.githubusercontent.com/ZhyMc/chaoxing-xuexitong-autoflush/master/imgs/chaoxing2.png)

---

```
若该程序对你有帮助，请给作者一颗star以表示鼓励，谢谢！
```

---

用法:

---

①

```
git clone https://github.com/ZhyMc/chaoxing-xuexitong-autoflush
```

②

```
cd chaoxing-xuexitong-autoflush   (到程序目录底下)
```

③

```
npm install
```

之后你就可以通过执行

```
npm start
```

启动本程序

---

如果看不懂上面的步骤（上面步骤需要一点编程知识），你可以参照详细使用步骤：

Windows (x64)系统:

① 进入 http://nodejs.cn/download/ 下载 nodejs 的 "windows 安装包"  
② 打开安装包并安装，以保证你的机器拥有 Node.js 运行环境  
③ 进入 http://npm.taobao.org/mirrors/git-for-windows/v2.26.0-rc2.windows.1/ 下载 git 安装包  
你可以选择此版本：Git-2.26.0-rc2-64-bit.exe  
④ 打开安装包并安装，以保证你的机器拥有 Git 环境。

⑤ 打开命令行，你可以按 Win 键+R，然后输入 cmd 打开  
⑥ 依次敲入命令并执行

```
git clone https://github.com/ZhyMc/chaoxing-xuexitong-autoflush
```

```
cd chaoxing-xuexitong-autoflush
```

```
npm install
```

每次执行请等待命令的执行完毕再运行下一个命令  
然后通过运行命令

```
npm start
```

启动本程序

⑦ 之后你都可以通过打开 cmd (Win+R) 再运行

```
cd chaoxing-xuexitong-autoflush
```

```
npm start
```

的方式启动本程序

---

说明：

```
本程序会自动遍历你的所有课程，课程的所有章节，甚至包括上锁的章节内的视频都会被自动刷完。
所以你可以挂机本程序至后台。因为由 Node.js 平台编写，你可以在Linux下运行本程序.
```
