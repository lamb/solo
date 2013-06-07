var path = require('path'),
	fs = require('fs'),
	moment = require('moment'),
	jade = require('jade'),
	markdown = require('markdown-js').markdown,
	util = require('../util.js'),
	tooSolo = global.tooSolo,
	tmplPath = tooSolo.config.skinPath,
	indexPath = tooSolo.config.distPath;



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
		pageCount = Math.ceil(tooSolo.blog.blogs.length / 5);

	compileLocals.basePath = '.';

	compileLocals.blogName = tooSolo.config.blogName;
	compileLocals.pageTitle = compileLocals.blogName;
	compileLocals.blogSubTitle = tooSolo.config.blogSubTitle;
	compileLocals.blogKeywords = tooSolo.config.blogKeywords;
	compileLocals.blogDescription = tooSolo.config.blogDescription;
	
	compileLocals.pages = tooSolo.blog.pages;
	compileLocals.category = tooSolo.blog.category;


	compileLocals.pageCount = pageCount;

	blogList = tooSolo.blog.blogs.slice();

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
	// console.log(compileLocals.category);

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