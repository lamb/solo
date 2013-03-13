var path = require('path'),
	fs = require('fs'),
	jade = require('jade'),
	moment = require('moment'),
	markdown = require('markdown-js').markdown,
	util = require('../util.js'),
	tmplPath = global.config.skinPath,
	articlePath = path.resolve(global.config.distPath + '/article');

var buildArticles = function(){

	util.rmdirSyncRecursive(articlePath,function(){});
	util.mkdirSyncRecursive(articlePath);

	var articleTmpl = fs.readFileSync(tmplPath + '/html/article.jade','utf-8'),
		articleCompileFunc = jade.compile(articleTmpl,{filename:tmplPath + '/html/article.jade',pretty:true}),
		compileLocals = {};

	compileLocals.blogName = global.config.blogName;
	compileLocals.blogSubTitle = global.config.blogSubTitle;
	compileLocals.blogKeywords = global.config.blogKeywords;
	compileLocals.blogDescription = global.config.blogDescription;
	
	compileLocals.pages = global.blog.pages;
	compileLocals.category = global.blog.category;

	global.blog.blogs.forEach(function(blog){
		console.log('        ' + blog.url + '.html');
		_buildArticle(blog,articleCompileFunc,compileLocals);
	});

}

function _buildArticle(blog,articleCompileFunc,compileLocals){

	compileLocals.title = blog.title;
	compileLocals.pageTitle = compileLocals.title + ' - ' + compileLocals.blogName;
	compileLocals.pubDate = moment(blog.date).format('YYYY-MM-DD HH:mm:ss');
	compileLocals.content = markdown(blog.content);
	fs.writeFileSync(articlePath + '/' + blog.url + '.html',articleCompileFunc(compileLocals));

}

module.exports = function(){

	console.log('\n    博客文章页面构建……');
	buildArticles();

}