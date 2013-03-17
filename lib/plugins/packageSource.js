var path = require('path'),
	fs = require('fs'),
	moment = require('moment'),
	zip = require('toozip'),
	util = require('../util.js'),
	sourcePath = global.config.sourcePath,
	distPath = global.config.distPath + '/.source';

module.exports = function(){

	console.log('\n    打包源文件……');

	util.rmdirSyncRecursive(distPath,function(){});
	util.mkdirSyncRecursive(distPath);
	
	console.log('\n        复制source目录……');
	util.copyDirSyncRecursive(sourcePath,distPath + '/soucre');

	console.log('\n        复制config.json……');
	fs.writeFileSync(distPath+'/config.json',JSON.stringify(config,null,4));

	console.log('\n        压缩源文件……');
	var archive = new zip();
	archive.zipFolder(global.config.distPath,'source_' + moment().format('YYYYMMDDHHmmss') + '.zip');

	console.log('\n        清理临时文件……');
	util.rmdirSyncRecursive(distPath,function(){});


}
