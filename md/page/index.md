# solo(独唱团)这是一个由Node构建的静态博客

+ 这个静态博客是用markdown来写文章，通过皮肤模板可以build出html页面。
+ 你可以将他提交至GithubPages或者云端（七牛）或者一个Node服务器。
+ 这里有示例:[Pages](http://jinyang.mynah.org/)[七牛](http://qiniu.mynah.org/)

### 为什么会有这样一个静态博客

+ 以前的博客不方便添加自己的demo例子页面(前端开发的童鞋应该会有强烈的认同感)
+ markdown语法简洁易用，所见即所得的html编辑器不好用也太重
+ 不依赖于数据库，所有的内容都是文本，方便管理和迁移
+ 不需要一个什么复杂的服务器，也不需要担心什么配额，可以托管html页面就可以
+ 不用为图片文件等外链来发愁，直接放到相应的目录下，一起上传即可

### 如何部署

+ 你可以在[这里](https://github.com/lambgao/solo)找到他。
+ 如果你熟悉[Github Pages](http://pages.github.com/),可以直接Push到你的Pages仓库即可。
+ 如果有一个Node服务器，那么你可以部署至你的服务器,启动app.js即可。
+ 如果你有一个云端（七牛）服务，那么你可以上传至你的云端(运行lib/publish.js)。

### 如何使用

+ 你会发现根目录下md文件夹，这个里面存放的都是博客内容(markdown格式)。
+ md下有article和page两个文件夹，从字面上就很容易理解，分别是文章和页面。
+ md/article下面的文章在build之后会在article目录下生成同文件名的html页面
+ md/page下面的页面在build之后会在根目录下生成同文件名的html页面
+ 运行lib/build.js来build页面(请先安装[Node](http://www.nodejs.org/),并安装依赖npm install)

###皮肤模板修改

+ 你会发现根目录下skin文件夹,这个文件夹里面存放的都是皮肤模板(html文件)。
+ 上面提到了article和page两种页面，那么皮肤模板也提供了article.html和page.html两个模板文件。
+ 如果两个页面用到了共同的内容那么你可以把共同的内容提取出来放到skin/slot文件夹下。
+ 在模板文件中${slot}就可以将这个文件引入到当前模板文件中。
+ ${article}这个变量用于引入文章或者页面的内容，即md文件夹下生成的内容。
+ 根目录下你还会发现css、image、javascript文件夹，这些是存放模板使用到的静态文件

###有疑问或者...

+ 如果你有疑问、建议、bug提交或者想说“我艹，这里怎么能这样”都可以找我。
+ 找我请这里新浪微博[@金氧](http://weibo.com/lambsand),或这里Github[@lambgao](https://github.com/lambgao)

