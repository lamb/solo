var path = require('path'),
	fs = require('fs'),
	moment = require('moment'),
	util = require('./util.js');
	// sourcePath = path.normalize('./' + config.sourcePath),
	// distPath = path.normalize('./' + config.distPath);

function parseBlogs(){

	var blogFileListPath = global.config.sourcePath + '/blogs',
		blogFileList = util.readdirSyncRecursive(blogFileListPath);
	
	blogFileList.forEach(function(blogFileName){

		if(!/\.md$/.test(blogFileName)) return;

		console.log('        ' + blogFileName);

		var blogFileContent = fs.readFileSync(blogFileListPath + '/' + blogFileName,'utf-8'),
			blogFileParseResult = _parseBlogContent(blogFileName,blogFileContent);

		// 处理博客列表
		global.blog.blogs.push(blogFileParseResult);

		// 处理tags
		_parseTags(blogFileParseResult);

		// 处理archives
		_parseArchives(blogFileParseResult);

	});

	// console.log(global.blog);

}

function parsePages(){

	var pageFileListPath = global.config.sourcePath + '/pages',
		pageFileList = util.readdirSyncRecursive(pageFileListPath);
	
	pageFileList.forEach(function(pageFileName){

		if(!/\.md$/.test(pageFileName)) return;

		console.log('        ' + pageFileName);

		var pageFileContent = fs.readFileSync(pageFileListPath + '/' + pageFileName,'utf-8'),
			pageFileParseResult = _parseBlogContent(pageFileName,pageFileContent);

		// 处理pages列表
		global.blog.pages.push(pageFileParseResult);

	});

	// console.log(global.blog);

}

// 解析博客文件正文
function _parseBlogContent(fileName,fileContent){

	var patterns = {
			title:/(?:Title ?: ?|\# ?)(.*)\n/i,
			date:/(?:Date ?: ?|_)(.*?)_?\n/i,
			status:/Status ?: ?(.*)\n/i,
			tags:/Tags ?: ?(.*)\n/i,
			category:/Category ?: ?(.*)\n/i,
			url:/Url ?: ?(.*)\n/i
		},
		defaultValue = {
			title:'',
			date:new Date(),
			status:'Public',
			tags:'',
			category:'',
			url:fileName.replace(/\.md$/,'').replace(/.*\//,'')
		},
		blog = {};

	for(var item in patterns){
		if(patterns.hasOwnProperty(item)){

			var matchResult = fileContent.match(patterns[item]);

			blog[item] = matchResult && matchResult.length >=2 && matchResult[1] || defaultValue[item];

		}
	
		fileContent = fileContent.replace(patterns[item],'');

	}

	blog.date = moment(blog.date).toDate();
	blog.tags = blog.tags.split(' ').filter(function(tag){return tag});
	blog.content = fileContent.replace('\n\n$$solo_more$$','');
	blog.summary = fileContent.split('\n\n$$solo_more$$')[0];
	blog.id = util.getRandomId();

	return blog;

}

// 处理tags
function _parseTags(blog){

	blog.tags.forEach(function(tag){

		if(!global.blog.tags[tag]){
			global.blog.tags[tag] = [];
		}

		global.blog.tags[tag].push(blog.id);

	});

}

// 处理archives
function _parseArchives(blog){

	var archiveMonth = moment(blog.date).format('YYYY-MM');

	if(!global.blog.archives[archiveMonth]){
		global.blog.archives[archiveMonth] = [];
	}

	global.blog.archives[archiveMonth].push(blog.id);


}

// 处理分类
function _parseArchives(blog){

	var category = blog.category;

	if(!category)return;

	if(!global.blog.category[category]){
		global.blog.category[category] = [];
	}

	global.blog.category[category].push(blog.id);


}

exports.parse = function(){

	global.blog = {
		blogs:[],
		pages:[],
		tags:{},
		archives:{}
	};


	console.log('\n    解析博客……');
	parseBlogs();
	console.log('\n    解析Pages……');
	parsePages();

};