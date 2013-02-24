var config = require('./config.json'),
	// build = require('./lib/build.js'),
	copy = require('./lib/copy.js'),
	// publish = require('./lib/publish'),
	coreParser = require('./lib/coreparser.js'),
	action = process.argv.length>=2 ? process.argv[2] : '';

console.log('Solo 2.0');
coreParser.parse();	// 解析博客内容
// console.log('action:'+action);

// console.log(copy);

solo(action);

function solo(action){

	if(!action){
		action = 'buildAll';
	}

	switch(action){

		// 构建所有
		case 'buildAll':

			break;

		// 构建文章
		case 'buildArticle':

			break;

		// 构建pages
		case 'buildPages':

			break;

		// 构建404
		case 'build404':
			break;

		// 构建RSS
		case 'buildRSS':
			break;

		// 复制公共文件
		case 'copyGlobalFiles':

			copy.copyGlobalFiles();

			break;

		// 复制图片
		case 'copyImages':

			break;

		// 复制附件
		case 'copyAttachments':

			break;

		// 复制模板文件
		case 'copyTemplateFiles':

			break;

		// 发布到github
		case 'publishToGithub':

			break;


	}

}