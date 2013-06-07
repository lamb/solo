var path = require('path'),
	fs = require('fs'),
	util = require('../util.js'),
	sourcePath = global.config.skinPath,
	distPath = global.config.distPath;

module.exports = function(){
	console.log('\n    复制皮肤文件……');
	util.copyDirSyncRecursive(sourcePath,distPath,{preserve:true});
	util.rmdirSyncRecursive(distPath + '/html'); //删除掉html模板目录
}
