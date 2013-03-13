var path = require('path'),
	fs = require('fs'),
	jade = require('jade'),
	moment = require('moment'),
	markdown = require('markdown-js').markdown,
	util = require('../util.js'),
	tmplPath = global.config.skinPath,
	pagePath = global.config.distPath + '/page';

var buildArticles = function(){

	util.rmdirSyncRecursive(pagePath,function(){});
	util.mkdirSyncRecursive(pagePath);

	var pageTmpl = fs.readFileSync(tmplPath + '/html/page.jade','utf-8'),
		pageCompileFunc = jade.compile(pageTmpl,{filename:tmplPath + '/html/page.jade',pretty:true}),
		compileLocals = {};

	compileLocals.blogName = global.config.blogName;
	compileLocals.blogSubTitle = global.config.blogSubTitle;
	compileLocals.blogKeywords = global.config.blogKeywords;
	compileLocals.blogDescription = global.config.blogDescription;
	
	compileLocals.pages = global.blog.pages;
	compileLocals.category = global.blog.category;


	global.blog.pages.forEach(function(page){
		console.log('        ' + page.url + '.html');
		_buildArticle(page,pageCompileFunc,compileLocals);
	});

}

function _buildArticle(page,pageCompileFunc,compileLocals){

	compileLocals.title = page.title;
	compileLocals.pageTitle = compileLocals.title + ' - ' + compileLocals.blogName;
	compileLocals.pubDate = moment(page.date).format('YYYY-MM-DD HH:mm:ss');
	compileLocals.content = markdown(page.content);
	fs.writeFileSync(pagePath + '/' + page.url + '.html',pageCompileFunc(compileLocals));

}

module.exports = function(){

	console.log('\n    Pages页面构建……');
	buildArticles();

}