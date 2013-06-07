#!/usr/bin/env node

var path = require('path'),
	config = require(path.resolve(process.cwd() + '/config.json')),
	util = require('./lib/util.js'),
	// build = require('./lib/build.js'),
	// copy = require('./lib/copy.js'),
	// publish = require('./lib/publish'),
	coreParser = require('./lib/coreparser.js'),
	action = process.argv.length>=2 ? process.argv[2] : '';


if(!config.skinPath){
	config.skinPath = path.join(__dirname,'./skin');
}
global.config = config;

switch(action){

case 'defineSkin':
	
	console.log('\n==================== Solo 2.0 ====================\n');

	require('./lib/defineskin')();

	console.log('\n=================== 皮肤复制完毕 ===================\n');

	break;

default:

	console.log('\n==================== Solo 2.0 ====================\n');

	coreParser.parse();	// 解析博客内容
	_dealPlugins();	// 处理插件

	console.log('\n=================== 博客构建完成 ===================\n');
	break;
}


function _dealPlugins(){

	var pluginFileList = util.readdirSyncRecursive(path.join(__dirname,'./lib/plugins')),
		plugins = [];

	pluginFileList.forEach(function(plugin){

		if(config.disabledPlugins && config.disabledPlugins.indexOf(plugin.replace(/\.js$/,'')) > -1)return;

		if(/\.js$/.test(plugin)){
			// console.log(global.blog);
			var pluginName = plugin.replace(/\.js$/,'');
			plugins[pluginName] = require('./lib/plugins/'+plugin);
			plugins[pluginName]();
		}

	});

}