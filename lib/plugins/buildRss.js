var path = require('path'),
	fs = require('fs'),
	moment = require('moment'),
	jade = require('jade'),
	markdown = require('markdown-js').markdown,
	util = require('../util.js'),
	tmplPath = global.config.skinPath,
	rssPath = global.config.distPath + '/rss';

var buildRss = function(){

	// 删除旧rss文件
	util.rmdirSyncRecursive(rssPath,function(){});
	util.mkdirSyncRecursive(rssPath);

	var rssTmpl = fs.readFileSync(tmplPath + '/html/rss.jade','utf-8'),
		rssCompileFunc = jade.compile(rssTmpl,{pretty:true}),
		compileLocals = {},
		blogList;

	compileLocals.blogName = global.config.blogName;
	compileLocals.domain = global.config.domain;
	compileLocals.blogDescription = global.config.blogDescription;

	blogList = global.blog.blogs.slice(0,20);

	blogList.sort(function(blog1,blog2){

		var date1 = +blog1.date,
			date2 = +blog2.date;

		return date1<date2 ? 1:-1;

	});

	compileLocals.blogList = blogList;
	// console.log(global.blog);
	compileLocals.pubDate = util.formatToRfc822(blogList[0].date);

	console.log('        rss.xml');
	_buildRssFile('rss.xml',rssCompileFunc,compileLocals)

}

function _buildRssFile(fileName,rssCompileFunc,compileLocals){

	compileLocals.blogList.forEach(function(blogItem){
		blogItem.content = markdown(blogItem.content);
		blogItem.pubDate = util.formatToRfc822(blogItem.date);
	});
	fs.writeFileSync(rssPath + '/' + fileName,rssCompileFunc(compileLocals));

}

module.exports = function(){

	console.log('\n    RSS构建……');
	buildRss();
}