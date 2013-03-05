var path = require('path'),
	fs = require('fs'),
	moment = require('moment'),
	jade = require('jade'),
	markdown = require('markdown-js').markdown,
	util = require('../util.js'),
	tmplPath = global.config.skinPath,
	indexPath = global.config.distPath;



var buildIndex = function(){
    
    util.mkdirSyncRecursive(indexPath);

	// 删除旧首页文件
	fs.readdirSync(indexPath).forEach(function(indexItem){
		if(!/^index.*\.html$/.test(indexItem))return;
		fs.unlinkSync(indexPath + '/' + indexItem);
	});

	var indexTmpl = fs.readFileSync(tmplPath + '/html/index.jade','utf-8'),
		indexCompileFunc = jade.compile(indexTmpl,{filename:tmplPath + '/html/index.jade',pretty:true}),
		compileLocals = {},
		blogList,
		pageCount = Math.ceil(global.blog.blogs.length / 5);

	compileLocals.blogName = global.config.blogName;
	compileLocals.blogSubTitle = global.config.blogSubTitle;
	compileLocals.blogKeywords = global.config.blogKeywords;
	compileLocals.blogDescription = global.config.blogDescription;
	
	compileLocals.pages = global.blog.pages;
	compileLocals.category = global.blog.category;


	compileLocals.pageCount = pageCount;

	blogList = global.blog.blogs.slice();

	blogList.sort(function(blog1,blog2){

		var date1 = +blog1.date,
			date2 = +blog2.date;

		return date1<date2 ? 1:-1;

	});

	for(var i=0;i < pageCount;i++){
		var fileName = 'index' + (i?('_page'+(i+1)):'') + '.html';
		console.log('        ' + fileName);
		compileLocals.blogList = blogList.slice().splice(5*i,5);
		_buildIndexFile(fileName,indexCompileFunc,compileLocals);
	}

}

function _buildIndexFile(fileName,indexCompileFunc,compileLocals){
	compileLocals.blogList.forEach(function(blogItem){
		blogItem.summary = markdown(blogItem.summary);
		blogItem.pubDate = moment(blogItem.date).format('YYYY-MM-DD')
	});
	fs.writeFileSync(indexPath + '/' + fileName,indexCompileFunc(compileLocals));

}

module.exports = function(){

	console.log('\n    首页构建……');
	buildIndex();
}