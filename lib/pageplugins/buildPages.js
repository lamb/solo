var path = require('path'),
	fs = require('fs'),
	jade = require('jade'),
	moment = require('moment'),
	markdown = require('markdown-js').markdown,
	util = require('../util.js'),
	tooSolo = global.tooSolo,
	tmplPath = tooSolo.config.skinPath,
	pagePath = tooSolo.config.distPath + '/page';

var buildArticles = function(){

	util.rmdirSyncRecursive(pagePath,function(){});
	util.mkdirSyncRecursive(pagePath);

	var pageTmpl = fs.readFileSync(tmplPath + '/html/page.jade','utf-8'),
		pageCompileFunc = jade.compile(pageTmpl,{filename:tmplPath + '/html/page.jade',pretty:true}),
		compileLocals = {};

	compileLocals.basePath = '..';

	compileLocals.blogName = tooSolo.config.blogName;
	compileLocals.blogSubTitle = tooSolo.config.blogSubTitle;
	compileLocals.blogKeywords = tooSolo.config.blogKeywords;
	compileLocals.blogDescription = tooSolo.config.blogDescription;
	
	compileLocals.pages = tooSolo.blog.pages;
	compileLocals.categories = tooSolo.blog.categories;


	tooSolo.blog.pages.forEach(function(page){
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