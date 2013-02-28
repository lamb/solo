# solo 是一个由Node构建的静态博客

- 这个静态博客是用markdown来写文章，通过皮肤模板可以build出html页面。
- 你可以将他提交至Github Pages等任何网站空间。
- 示例:<http://solo.toobug.net>

## 2.0 预览版特性

- 程序、源文件、构建结果完全分离，托管时只需要上传构建结果即可
- 全插件构架，可以任意扩展你需要的功能（标签、分类、RSS等等）

> 目前版本只供预览，尚有未开发完（分类和pages的导航、皮肤的公共部分等）或者不稳定的部分。

## 用法说明

###　安装

	npm install -g toosolo

### 准备源文件目录

请准备一个目录作为博客源文件，里面包含博客、pages、公用的文件等等，具体包含内容如下：

- `blogs`目录，用于存放博客文件（.md后缀），可以包含任意子目录。
- `pages`目录，用于存放pages（.md后续），可以包含任意子目录。
- `global`目录，用于存放其它放到站点根目录的文件，如robots.txt等。可包含子目录（比如文章中的图片放在images子目录，构建时会被复制为/images）。

### 准备config.json

	{

		"blogName" : "SOLO",
		"blogSubTime" : "Life is Solo..."
		"blogKeywords" : "SOLO,Blog,Node,博客",
		"blogDescription" : "TooBug - 专注前端开发",

		"domain" : "solo.toobug.net",

		"sourcePath" : "./source",
		"distPath" : "./dist"

	}

其中`domain`不需要加`http://`和最后的`/`，`sourcePath`是上面准备的源文件的路径，`distPath`是构建结果的路径。所有路径相对于`config.json`。

### 编译

进入命令行，定位到`config.json`所在的目录，运行`toosolo`即可。

### 更多

如果有需要可以自定义皮肤，在`config.json`中添加一个配置项为`skinPath`即可。

皮肤目录下的子目录说明

- `html`目录，模板文件，使用`jade`模板引擎，目前包含`index.jade`，`page.jade`，`article.jade`三个文件。
- 其它目录，直接被复制到站点根目录。

编写模板时请注意路径，编译的结果中`index.html`在根目录，文章和pages分别在`/article`和`/page`目录。

详细的皮肤编写指导稍后放出。

