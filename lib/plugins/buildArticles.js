var path = require('path'),
	fs = require('fs'),
	jade = require('jade'),
	moment = require('moment'),
	markdown = require('markdown-js').markdown,
	util = require('../util.js'),
	tmplPath = global.config.skinPath,
	articlePath = global.config.distPath + '/article';

var buildArticles = function(){

	util.rmdirSyncRecursive(articlePath,function(){});
	util.mkdirSyncRecursive(articlePath);

	var articleTmpl = fs.readFileSync(tmplPath + '/html/article.jade','utf-8'),
		articleCompileFunc = jade.compile(articleTmpl,{pretty:true}),
		compileLocals = {};

	compileLocals.blogName = global.config.blogName;
	compileLocals.blogKeywords = global.config.blogKeywords;
	compileLocals.blogDescription = global.config.blogDescription;

	global.blog.blogs.forEach(function(blog){
		_buildArticle(blog,articleCompileFunc,compileLocals);
	});

}

function _buildArticle(blog,articleCompileFunc,compileLocals){

	console.log(articlePath + '/' + blog.url + '.html');
	compileLocals.title = blog.title;
	compileLocals.pubDate = moment(blog.date).format('YYYY-MM-DD HH:mm:ss');
	compileLocals.content = markdown(blog.content);
	fs.writeFileSync(articlePath + '/' + blog.url + '.html',articleCompileFunc(compileLocals));

}

module.exports = function(){

	console.log('文章构建开始');
	buildArticles();
	console.log('文章构建成功');
}