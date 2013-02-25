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

exports.mkdirSyncRecursive = function(pathName, mode) {
    var self = this;
    pathName = path.normalize(pathName)

    try {
        fs.mkdirSync(pathName, mode);
    } catch(err) {
        if(err.code == "ENOENT") {
            var slashIdx = path.lastIndexOf(pathName.sep);

            if(slashIdx > 0) {
                var parentPath = pathName.substring(0, slashIdx);
                mkdirSyncRecursive(parentPath, mode);
                mkdirSyncRecursive(pathName, mode);
            } else {
                throw err;
            }
        } else if(err.code == "EEXIST") {
            return;
        } else {
            throw err;
        }
    }
};

/*  wrench.rmdirSyncRecursive("directory_path", forceDelete, failSilent);
 *
 *  Recursively dives through directories and obliterates everything about it. This is a
 *  Sync-function, which blocks things until it's done. No idea why anybody would want an
 *  Asynchronous version. :\
 */
exports.rmdirSyncRecursive = function(pathName, failSilent) {
    var files;

    try {
        files = fs.readdirSync(pathName);
    } catch (err) {
        if(failSilent) return;
        throw new Error(err.message);
    }

    /*  Loop through and delete everything in the sub-tree after checking it */
    for(var i = 0; i < files.length; i++) {
        var currFile = fs.lstatSync(path.join(pathName, files[i]));

        if(currFile.isDirectory()) // Recursive function back to the beginning
            exports.rmdirSyncRecursive(path.join(pathName, files[i]));

        else if(currFile.isSymbolicLink()) // Unlink symlinks
            fs.unlinkSync(path.join(pathName, files[i]));

        else // Assume it's a file - perhaps a try/catch belongs here?
            fs.unlinkSync(path.join(pathName, files[i]));
    }

    /*  Now that we know everything in the sub-tree has been deleted, we can delete the main
     directory. Huzzah for the shopkeep. */
    return fs.rmdirSync(pathName);
};

exports.getRandomId = function(){

	return (Math.random()+'').substr(2);

};