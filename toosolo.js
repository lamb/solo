#!/usr/bin/env node

var path = require('path'),
	Q = require('q'),
	config = require(path.resolve(process.cwd() + '/config.json')),
	util = require('./lib/util.js'),
	coreParser = require('./lib/coreparser.js'),
	pluginName = process.argv.length>=2 ? process.argv[2] : '';

init();

function init(){

	global.tooSolo = {};

	if(!config.skinPath){
		config.skinPath = path.join(__dirname,'./skin');
	}

	global.tooSolo.config = config;

	console.log('\n==================== Solo 2.0 ====================\n');

	if(pluginName){	//如果指定了插件名字，则调用对应插件

		require('./lib/plugins'+pluginName)();

	}else{

		coreParser.parse();	// 解析博客内容
		_dealParserPlugins();	// 处理插件
		// _dealPagePlugins();	// 处理插件

	}

	console.log('\n=================== 博客构建完成 ===================\n');
	
}

function _dealParserPlugins(){

	var parserPluginFileList = util.readdirSyncRecursive(path.join(__dirname,'./lib/parserplugins')),
		plugins = [],
		dfd = Q.when();

	parserPluginFileList.forEach(function(plugin){

		if(config.disabledParserPlugins && config.disabledParserPlugins.indexOf(plugin.replace(/\.js$/,'')) > -1)return;

		if(/\.js$/.test(plugin)){

			var pluginName = plugin.replace(/\.js$/,'');
			plugins[pluginName] = require('./lib/plugins/'+plugin);
			dfd = dfd.then(plugins[pluginName]);
			
		}

	});

}

function _dealPagePlugins(){

	var pagePluginFileList = util.readdirSyncRecursive(path.join(__dirname,'./lib/pageplugins')),
		plugins = [],
		dfd = Q.when();

	pagePluginFileList.forEach(function(plugin){

		if(config.disabledPagePlugins && config.disabledPagePlugins.indexOf(plugin.replace(/\.js$/,'')) > -1)return;

		if(/\.js$/.test(plugin)){

			var pluginName = plugin.replace(/\.js$/,'');
			plugins[pluginName] = require('./lib/plugins/'+plugin);
			dfd = dfd.then(plugins[pluginName]);
			
		}

	});

}