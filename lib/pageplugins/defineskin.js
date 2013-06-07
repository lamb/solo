var path = require('path'),
	fs = require('fs'),
	util = require('../util.js'),
	configPath = path.resolve(process.cwd() + '/config.json'),
	config = require(configPath),
	sourcePath = path.join(__dirname,'../skin'),
	tooSolo = global.tooSolo,
	distPath = tooSolo.config.sourcePath + '/skin';

module.exports = function(){
	console.log('\n    复制皮肤文件……');
	util.copyDirSyncRecursive(sourcePath,distPath);
	console.log('\n    修改配置文件……');
	config.skinPath = distPath;
	fs.writeFileSync(configPath,JSON.stringify(config,null,4));
}
