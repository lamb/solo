#!/usr/bin/env node

var path = require('path'),
	Q = require('q'),
	config = require(path.resolve(process.cwd() + '/config.json')),
	util = require('./lib/util.js'),
	coreParser = require('./lib/coreparser.js'),
	pluginName = process.argv.length>=2 ? process.argv[2] : '';

init();

function init(){

	Q.longStackSupport = true;

	var dfd = Q.when();

	global.tooSolo = {};

	if(!config.skinPath){
		config.skinPath = path.join(__dirname,'./skin');
	}
	if(!config.globalPath){
		config.globalPath = path.join(config.sourcePath,'./global');
	}
	if(!config.blogPath){
		config.blogPath = path.join(config.sourcePath,'./blogs');
	}

	global.tooSolo.config = config;

	dfd = dfd.then(function(){
		console.log('\n==================== Solo 2.0 ====================\n');
	});

	if(pluginName){	//如果指定了插件名字，则调用对应插件

		dfd = dfd.then(function(){
			require('./lib/plugins'+pluginName)();
		});


	}else{

		dfd = dfd.then(coreParser.parse).then(_dealParserPlugins).then(_dealPagePlugins);

	}
	dfd = dfd.then(function(){
		console.log('\n=================== 博客构建完成 ===================\n');
	});
	
}

function _dealParserPlugins(){

	var parserPluginFileList = util.readdirSyncRecursive(path.join(__dirname,'./lib/parserplugins')),
		plugins = [],
		pluginsDfd = Q.when(),
		thisDfd = Q.defer();

	parserPluginFileList.forEach(function(plugin){

		if(config.disabledParserPlugins && config.disabledParserPlugins.indexOf(plugin.replace(/\.js$/,'')) > -1)return;

		if(/\.js$/.test(plugin)){

			var pluginName = plugin.replace(/\.js$/,'');
			plugins[pluginName] = require('./lib/parserplugins/'+plugin);
			pluginsDfd = pluginsDfd.then(plugins[pluginName]);
			
		}

	});
	pluginsDfd.then(function(){
		thisDfd.resolve();
	}).fail(function(error){
		console.log(error);
	})

	return thisDfd.promise;

}

function _dealPagePlugins(dfd){

	var pagePluginFileList = util.readdirSyncRecursive(path.join(__dirname,'./lib/pageplugins')),
		plugins = [],
		pluginsDfd = Q.when(),
		thisDfd = Q.defer();
		

	pagePluginFileList.forEach(function(plugin){


		if(config.disabledPagePlugins && config.disabledPagePlugins.indexOf(plugin.replace(/\.js$/,'')) > -1)return;

		if(/\.js$/.test(plugin)){

			var pluginName = plugin.replace(/\.js$/,'');
			plugins[pluginName] = require('./lib/pageplugins/'+plugin);
			pluginsDfd = pluginsDfd.then(plugins[pluginName]);
			
		}

	});

	pluginsDfd.then(function(){
		thisDfd.resolve();
	}).fail(function(error){
		console.log(error);
	});

	return thisDfd.promise;

}