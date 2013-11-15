var fs = require('fs');
var exec = require('child_process').exec;

module.exports = function(input, out, options, callback) {
	
	if (!out) {
		out = input.replace(/\.ts$/, '.js');
	}

	var cl = 'tsc --out ' + out + ' ';
	if (!!options.sourceMap) {
		cl += '--sourcemap ';
	}

	cl += input;

	exec(cl, function(error, stdout, stderr) {
		stdout && console.log('stdout: ' + stdout);
		stderr && console.log('stderr: ' + stderr);

		if (error) {
			callback(error, null);
		} else {
			fs.readFile(out, 'utf8', function(error, content) {
				callback(error, { js: content });
			});
		}
	});
};