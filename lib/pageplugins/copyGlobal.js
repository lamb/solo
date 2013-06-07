var path = require('path'),
	fs = require('fs'),
	util = require('../util.js'),
	tooSolo = global.tooSolo,
	sourcePath = tooSolo.config.sourcePath + '/global',
	distPath = tooSolo.config.distPath;

module.exports = function(){
	console.log('\n    复制全局文件……');
	util.copyDirSyncRecursive(sourcePath,distPath,{preserve:true});
}
