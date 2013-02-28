var path = require('path'),
	fs = require('fs'),
    moment = require('moment');

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

var mkdirSyncRecursive = function(pathName, mode) {
    var self = this;

    try {
        fs.mkdirSync(pathName, mode);
    } catch(err) {
        if(err.code == "ENOENT") {
            var slashIdx = pathName.lastIndexOf(path.sep);
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
exports.mkdirSyncRecursive = mkdirSyncRecursive;

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

/*  wrench.copyDirSyncRecursive("directory_to_copy", "new_directory_location", opts);
 *
 *  Recursively dives through a directory and moves all its files to a new location. This is a
 *  Synchronous function, which blocks things until it's done. If you need/want to do this in
 *  an Asynchronous manner, look at wrench.copyDirRecursively() below.
 *
 *  Note: Directories should be passed to this function without a trailing slash.
 */
exports.copyDirSyncRecursive = function(sourceDir, newDirLocation, opts) {
    if (!opts || !opts.preserve) {
        try {
            if(fs.statSync(newDirLocation).isDirectory()) exports.rmdirSyncRecursive(newDirLocation);
        } catch(e) { }
    }

    /*  Create the directory where all our junk is moving to; read the mode of the source directory and mirror it */
    var checkDir = fs.statSync(sourceDir);
    try {
        fs.mkdirSync(newDirLocation, checkDir.mode);
    } catch (e) {
        //if the directory already exists, that's okay
        if (e.code !== 'EEXIST') throw e;
    }

    var files = fs.readdirSync(sourceDir);

    for(var i = 0; i < files.length; i++) {
        // ignores all files or directories which match the RegExp in opts.filter
        if(typeof opts !== 'undefined') {
            if(!opts.whitelist && opts.filter && files[i].match(opts.filter)) continue;
            // if opts.whitelist is true every file or directory which doesn't match opts.filter will be ignored
            if(opts.whitelist && opts.filter && !files[i].match(opts.filter)) continue;
            if (opts.excludeHiddenUnix && /^\./.test(files[i])) continue;
        }

        var currFile = fs.lstatSync(path.join(sourceDir, files[i]));

        var fCopyFile = function(srcFile, destFile) {
            if(typeof opts !== 'undefined' && opts.preserveFiles && fs.existsSync(destFile)) return;

            var contents = fs.readFileSync(srcFile);
            fs.writeFileSync(destFile, contents);
        };

        if(currFile.isDirectory()) {
            /*  recursion this thing right on back. */
            exports.copyDirSyncRecursive(path.join(sourceDir, files[i]), path.join(newDirLocation, files[i]), opts);
        } else if(currFile.isSymbolicLink()) {
            var symlinkFull = fs.readlinkSync(path.join(sourceDir, files[i]));

            if (typeof opts !== 'undefined' && !opts.inflateSymlinks) {
                fs.symlinkSync(symlinkFull, path.join(newDirLocation, files[i]));
                continue;
            }

            var tmpCurrFile = fs.lstatSync(path.join(sourceDir, symlinkFull));
            if (tmpCurrFile.isDirectory()) {
                exports.copyDirSyncRecursive(path.join(sourceDir, symlinkFull), path.join(newDirLocation, files[i]), opts);
            } else {
                /*  At this point, we've hit a file actually worth copying... so copy it on over. */
                fCopyFile(path.join(sourceDir, symlinkFull), path.join(newDirLocation, files[i]));
            }
        } else {
            /*  At this point, we've hit a file actually worth copying... so copy it on over. */
            fCopyFile(path.join(sourceDir, files[i]), path.join(newDirLocation, files[i]));
        }
    }
};

exports.formatToRfc822 = function(date){

    return moment(date).format('ddd, DD MMM YYYY HH:mm:ss ZZ');

};

exports.getRandomId = function(){

	return (Math.random()+'').substr(2);

};