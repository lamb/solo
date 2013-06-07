var path = require('path'),
	fs = require('fs'),
	util = require('../util.js'),
	sourcePath = global.config.sourcePath + '/global',
	distPath = global.config.distPath;

module.exports = function(){
	console.log('\n    复制全局文件……');
	util.copyDirSyncRecursive(sourcePath,distPath,{preserve:true});
}
