var path = require('path'),
	fs = require('fs'),
	moment = require('moment'),
	util = require('./util.js');

function parseBlogs(){

	var blogFileListPath = global.tooSolo.config.blogPath,
		blogFileList = util.readdirSyncRecursive(blogFileListPath);
	
	blogFileList.forEach(function(blogFileName){

		if(!/\.md$/.test(blogFileName)) return;

		console.log('        ' + blogFileName);

		var blogFileContent = fs.readFileSync(blogFileListPath + '/' + blogFileName,'utf-8'),
			blogFileParseResult = _parseBlogContent(blogFileName,blogFileContent);

		// 处理博客列表
		global.tooSolo.blog.blogs.push(blogFileParseResult);

		// 处理tags
		_parseTags(blogFileParseResult);

		// 处理archives
		_parseArchives(blogFileParseResult);
		
		// 处理分类
		_parseCategory(blogFileParseResult);

	});

	// console.log(global.tooSolo.blog);

}

function parsePages(){

	var pageFileListPath = global.tooSolo.config.sourcePath + '/pages',
		pageFileList = util.readdirSyncRecursive(pageFileListPath);
	
	pageFileList.forEach(function(pageFileName){

		if(!/\.md$/.test(pageFileName)) return;

		console.log('        ' + pageFileName);

		var pageFileContent = fs.readFileSync(pageFileListPath + '/' + pageFileName,'utf-8'),
			pageFileParseResult = _parseBlogContent(pageFileName,pageFileContent);

		// 处理pages列表
		global.tooSolo.blog.pages.push(pageFileParseResult);

	});

	// console.log(global.tooSolo.blog);

}

// 解析博客文件正文
function _parseBlogContent(fileName,fileContent){

	var patterns = {
			title:/(?:Title ?: ?|\# ?)(.*)\n/i,
			date:/(?:Date ?: ?|_)(\d{4}-\d{1,2}-\d{1,2}.*?)_?\n/i,
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

	fileContent = fileContent.replace(/\r\n/g,'\n');

	for(var item in patterns){
		if(patterns.hasOwnProperty(item)){

			var matchResult = fileContent.match(patterns[item]);

			blog[item] = matchResult && matchResult.length >=2 && matchResult[1] || defaultValue[item];

		}
	
		fileContent = fileContent.replace(patterns[item],'');

	}

	blog.date = moment(blog.date).toDate();
	blog.content = fileContent.replace('\n\n$$solo_more$$','');
	blog.summary = fileContent.split('\n\n$$solo_more$$')[0];
	blog.id = util.getRandomId();

	var tagsArr = [],
		tempBound,
		tempTag='';

	blog.tags.split(' ').forEach(function(tag){

		if(/^['"]/.test(tag)){ //如果以引号开头

			if(/['"]$/.test(tag)){	//如果以引号结尾，则直接push
				tagsArr.push(tag.replace(/^['"]/,'').replace(/['"]$/,''));
			}else{ //不以引号结尾，暂存
				tempTag += tag.replace(/^['"]/,'');
			}

		}else{

			if(/['"]$/.test(tag)){ //如果以引号结尾，则直接push
				tagsArr.push(tempTag + ' ' + tag.replace(/^['"]/,'').replace(/['"]$/,''));
				tempTag = '';
			}else{
				tempTag += ' ' + tag;
			}

		}

	});

	blog.tags = tagsArr;

	return blog;

}

// 处理tags
function _parseTags(blog){

	blog.tags.forEach(function(tag){

		if(!global.tooSolo.blog.tags[tag]){
			global.tooSolo.blog.tags[tag] = [];
		}

		global.tooSolo.blog.tags[tag].push(blog.id);

	});

}

// 处理archives
function _parseArchives(blog){

	var archiveMonth = moment(blog.date).format('YYYY-MM');

	if(!global.tooSolo.blog.archives[archiveMonth]){
		global.tooSolo.blog.archives[archiveMonth] = [];
	}

	global.tooSolo.blog.archives[archiveMonth].push({id:blog.id});


}

// 处理分类
function _parseCategory(blog){

	var category = blog.category;

	if(!category)return;

	if(!global.tooSolo.blog.categories[category]){
		global.tooSolo.blog.categories[category] = {
			blogList:[]
		};
	}

	global.tooSolo.blog.categories[category].blogList.push({id:blog.id});


}

exports.parse = function(){

	global.tooSolo.blog = {
		blogs:[],
		pages:[],
		tags:{},
		archives:{},
		categories:{}
	};


	console.log('\n    解析博客……');
	parseBlogs();
	if(!global.tooSolo.config.disabledParsePlugins || global.tooSolo.config.disabledParsePlugins.indexOf('parsePages')===-1){
		console.log('\n    解析Pages……');
		parsePages();
	}

};