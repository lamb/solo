# [消除你对Wind.js的疑虑 ](article/dispel-your-windjs's-doubts.html)
## 2012-08-13 23:52

### eval is (always) evil

> eval大概也算是整个ECMAScript语言中最强大的一个方法，
他就像是一个完整的ECMAScript解析器。你说它evil,我也承认这个
方法会存在危险，有可能带来安全问题，特别是在用它执行用户输入
数据的情况下。但Wind.js是用eval来运行已经“编译”后的代码，
让你更舒服顺畅的来编写异步回调的代码。这些代码是你自己写的，
所以不必担心代码注入、跨站脚本攻击这样的安全问题。没有这这个
困扰和担忧，我相信eval应该是美好的。

### API太丑，eval为什么不封装？

> 通过eval执行的代码是被认为是包含该次调用的执行环境的一部分，
因此被执行的代码具有与该执行环境有着相同的作用域链。

	var Wind = require("wind");
	
	var msg = 'hello world';
	eval("console.log(msg)");//hello world
	
	var msg = 'hello world';
	var newFunc = eval(Wind.compile("async", function () { 
		console.log(msg);
	}));
	newFunc().start();//hello world

> 变量msg是在eval外定义的，但eval中还是能够打印"hello world"。
如果包装起来如法访问到msg这个变量。

## [Read More](article/dispel-your-windjs's-doubts.html)

# [solo(独唱团)这是一个由Node构建的静态博客](article/what-is-solo.html)
## 2012-07-22 14:22

+ 这个静态博客是用markdown来写文章，通过皮肤模板可以build出html页面。
+ 你可以将他提交至GithubPages或者云端（七牛）或者一个Node服务器。
+ 这里有示例:[Pages](http://jinyang.mynah.org/)  [七牛](http://qiniu.mynah.org/)

### 为什么会有这样一个静态博客

+ 以前的博客不方便添加自己的demo例子页面(前端开发的童鞋应该会有强烈的认同感)
+ markdown语法简洁易用，所见即所得的html编辑器不好用也太重
+ 不依赖于数据库，所有的内容都是文本，方便管理和迁移
+ 不需要一个什么复杂的服务器，也不需要担心什么配额，可以托管html页面就可以
+ 不用为图片文件等外链来发愁，直接放到相应的目录下，一起上传即可

## [Read More](article/what-is-solo.html)

