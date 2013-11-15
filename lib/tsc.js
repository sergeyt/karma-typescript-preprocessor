var fs = require('fs');
var exec = require('child_process').exec;

module.exports = function(input, out, options, callback, log) {
	
	if (!out) {
		out = input.replace(/\.ts$/, '.js');
	}

	var cl = 'tsc --out ' + out + ' ';
	if (!!options.sourceMap) {
		cl += '--sourcemap ';
	}

	cl += input;

	exec(cl, function(error, stdout, stderr) {
		if (log) {
			stdout && log.debug('tsc stdout: ' + stdout);
			stderr && log.debug('tsc stderr: ' + stderr);
		} else {
			stdout && console.log('tsc stdout: ' + stdout);
			stderr && console.log('tsc stderr: ' + stderr);
		}

		// TODO fail on critical errors
//		if (error) {
//			callback(error, null);
//			return;
//		}

		fs.readFile(out, 'utf8', function(error, content) {
			if (error) {
				callback(error);
				return;
			}
			fs.unlink(out);
			callback(null, { js: content });
		});
	});
};