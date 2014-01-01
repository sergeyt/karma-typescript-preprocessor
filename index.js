var fs = require('fs'),
	path = require('path'),
	_ = require('lodash'),
	compile = require('node-tsc').compile;

var createTypeScriptPreprocessor = function(args, config, logger, helper) {
	config = config || {};

	var log = logger.create('preprocessor.typescript');
	var defaultOptions = {
		bare: true,
		sourceMap: false
	};

	var options = helper.merge(defaultOptions, args.options || {}, config.options || {});

	var transformPath = args.transformPath || config.transformPath || function(filepath) {
		return filepath.replace(/\.ts$/, '.js');
	};

	return function(content, file, done) {
		log.debug('Processing "%s".', file.originalPath);
		file.path = transformPath(file.originalPath);

		// Clone the options because tsc.compile could mutate them
		var opts = helper._.clone(options);

		try {
			tsc(file.originalPath, file.path, opts, function(error, result) {
				if (error) throw error;

				var output = result.js || result;

				if (opts.sourceMap) {
					sourceMapAsDataUri(content, file, file.path + '.map', function(datauri) {
						fs.unlink(file.path + '.map');
						output = output.replace(/\/\/# sourceMappingURL=.+\.js\.map\r?\n?/i, '');
						output += '\n//@ sourceMappingURL=' + datauri + '\n';
						done(output);
					});
				} else {
					done(output);
				}

			}, log);
		} catch(e) {
			log.error('%s\n  at %s', e.message, file.originalPath);
			return;
		}
	};
};

function sourceMapAsDataUri(content, file, sourceMapPath, callback) {
	fs.readFile(sourceMapPath, 'utf8', function(error, text) {
		if (error) throw error;
		var map = JSON.parse(text);
		map.sources[0] = path.basename(file.originalPath);
		map.sourcesContent = [content];
		map.file = path.basename(file.path);
		callback('data:application/json;charset=utf-8;base64,' + new Buffer(JSON.stringify(map)).toString('base64'));
	});
}

function tsc(input, output, options, callback, log) {

	if (!output) {
		output = input.replace(/\.ts$/, '.js');
	}

	var args = _.extend({}, options, {out: output});
	compile([input], args);

	fs.readFile(output, 'utf8', function(error, content) {
		if (error) {
			callback(error);
			return;
		}
		fs.unlink(output);
		callback(null, { js: content });
	});
}

createTypeScriptPreprocessor.$inject = ['args', 'config.typescriptPreprocessor', 'logger', 'helper'];

// PUBLISH DI MODULE
module.exports = {
	'preprocessor:typescript': ['factory', createTypeScriptPreprocessor]
};
