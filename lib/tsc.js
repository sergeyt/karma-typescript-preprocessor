var fs = require('fs');
var exec = require('child_process').exec;

module.exports = function(input, out, options, callback, log) {
	
	if (!out) {
		out = input.replace(/\.ts$/, '.js');
	}

	// use console as fallback log
	if (!log){
		log = {
			debug: function(msg){
				if (console.debug) {
					console.debug(msg);
				} else {
					console.log(msg);
				}
			}
		};
	}

	// tsc options schema:
	//   f - means flag option
	//   s - means string option
	var optionsDef = {
		module: 's', // Specify module code generation: 'commonjs' or 'amd'
		target: 's', // Specify ECMAScript target version: 'ES3' (default), or 'ES5'
		noImplicitAny: 'f', // Warn on expressions and declarations with an implied 'any' type.
		noResolve: 'f', // Skip resolution and preprocessing.
		removeComments: 'f' // Do not emit comments to output.
	};

	// gather tsc options
	var etc = Object.keys(optionsDef).filter(function(key){
		if (!options.hasOwnProperty(key)){
			return false;
		}
		var type = optionsDef[key];
		if (type == 'f'){
			return !!options[key];
		}
		return true;
	}).map(function(key){
		var type = optionsDef[key];
		if (type == 'f') {
			return '--' + key;
		}
		return '--' + key + ' ' + options[key];
	}).join(' ');

	// TODO fix issue #1, use tsc from node_modules
	// build tsc command line
	var cl = 'tsc --out ' + out + ' ';

	if (!!options.sourceMap || !!options.sourcemap) {
		cl += '--sourcemap ';
	}

	cl += etc ? etc + ' ' : '';
	cl += input;

	exec(cl, function(error, stdout, stderr) {
		stdout && log.debug('tsc stdout: ' + stdout);
		stderr && log.debug('tsc stderr: ' + stderr);

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