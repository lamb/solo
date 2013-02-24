var path = require('path'),
	fs = require('fs');

/*  wrench.readdirSyncRecursive("directory_path");
 *
 *  Recursively dives through directories and read the contents of all the
 *  children directories.
 */
exports.readdirSyncRecursive = function(baseDir) {
	baseDir = baseDir.replace(/\/$/, '');

	var readdirSyncRecursive = function(baseDir) {
		var files = [],
			curFiles,
			nextDirs,
			isDir = function(fname){
				return fs.statSync( path.join(baseDir, fname) ).isDirectory();
			},
			prependBaseDir = function(fname){
				return path.join(baseDir, fname);
			};

		curFiles = fs.readdirSync(baseDir);
		nextDirs = curFiles.filter(isDir);
		curFiles = curFiles.map(prependBaseDir);

		files = files.concat( curFiles );

		while (nextDirs.length) {
			files = files.concat( readdirSyncRecursive( path.join(baseDir, nextDirs.shift()) ) );
		}

		return files;
	};

	// convert absolute paths to relative
	var fileList = readdirSyncRecursive(baseDir).map(function(val){
		return path.relative(baseDir, val);
	});

	return fileList;
};
