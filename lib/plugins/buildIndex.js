var path = require('path'),
	fs = require('fs'),
	moment = require('moment'),
	jade = require('jade'),
	markdown = require('markdown-js').markdown,
	util = require('../util.js'),
	tmplPath = global.config.skinPath,
	indexPath = global.config.distPath;



var buildIndex = function(){

	// 删除旧首页文件
	fs.readdirSync(indexPath).forEach(function(indexItem){
		if(!/^index.*\.html$/.test(indexItem))return;
		fs.unlinkSync(indexPath + '/' + indexItem);
	});

	var indexTmpl = fs.readFileSync(tmplPath + '/html/index.jade','utf-8'),
		indexCompileFunc = jade.compile(indexTmpl,{pretty:true}),
		compileLocals = {},
		pageCount = Math.ceil(global.blog.blogs.length / 5);

	compileLocals.blogName = global.config.blogName;
	compileLocals.blogSubTitle = global.config.blogSubTitle;
	compileLocals.blogKeywords = global.config.blogKeywords;
	compileLocals.blogDescription = global.config.blogDescription;

	compileLocals.pageCount = pageCount;
	for(var i=0;i < pageCount;i++){
		compileLocals.blogList = global.blog.blogs.slice().splice(5*i,5);
		_buildIndexFile('index' + (i?('_page'+(i+1)):'') + '.html',indexCompileFunc,compileLocals);
	}

}

function _buildIndexFile(fileName,indexCompileFunc,compileLocals){
	console.log(indexPath + '/' + fileName);
	compileLocals.blogList.forEach(function(blogItem){
		blogItem.summary = markdown(blogItem.summary);
		blogItem.pubDate = moment(blogItem.date).format('YYYY-MM-DD')
	});
	fs.writeFileSync(indexPath + '/' + fileName,indexCompileFunc(compileLocals));

}

module.exports = function(){

	console.log('首页构建');
	buildIndex();
	console.log('首页构建成功');
}