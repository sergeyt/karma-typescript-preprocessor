var fs = require('fs'),
	path = require('path'),
	_ = require('lodash'),
	glob = require('glob'),
	compile = require('node-tsc').compile;

var createTypeScriptPreprocessor = function(args, config, logger, helper) {
	config = config || {};

	var log = logger.create('preprocessor.typescript');
	var defaultOptions = {
		bare: true,
		sourceMap: false
	};

	var typingPatterns = [].concat(config.typings || []);
	var typings = _.flatten(typingPatterns.map(function (pattern) {
		return glob.sync(pattern);
	}));

	var options = helper.merge(defaultOptions, args.options || {}, config.options || {});

	var transformPath = args.transformPath || config.transformPath || function(filepath) {
		return filepath.replace(/\.ts$/, '.js');
	};

	return function(content, file, done) {
		log.debug('preprocessing "%s".', file.originalPath);
		file.path = transformPath(file.originalPath);

		// Clone the options because tsc.compile could mutate them
		var opts = helper._.clone(options);

		try {
			tsc(file, content, typings, opts, function(error, output) {
				if (error) throw error;

				if (opts.sourceMap) {
					sourceMapAsDataUri(content, file, function(datauri) {
						fs.unlinkSync(file.sourceMapPath);
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

function sourceMapAsDataUri(content, file, callback) {
	fs.readFile(file.sourceMapPath, 'utf8', function(error, text) {
		if (error) throw error;
		var map = JSON.parse(text);
		map.sources[0] = path.basename(file.originalPath);
		map.sourcesContent = [content];
		map.file = path.basename(file.path);
		file.sourceMap = map;
		var datauri = 'data:application/json;charset=utf-8;base64,' + new Buffer(JSON.stringify(map)).toString('base64');
		callback(datauri);
	});
}

function tsc(file, content, typings, options, callback, log) {
	var args = _.clone(options);
	var inputExtension = file.originalPath.split('.').pop();
	var input  = file.originalPath + '.ktp.' + inputExtension;
	var output = file.originalPath + '.ktp.js';
	var concatenateOutput = args.concatenateOutput !== undefined ? args.concatenateOutput : !('module' in args);
	file.outputPath = output + '.ktp.js';
	file.sourceMapPath = output + '.map';

	if (concatenateOutput) {
		args.out = output;
	}

	var opts = {files: [input].concat(typings), args: args};

	fs.writeFileSync(input, content);

	if (options.compiler) {
		delete args.compiler;
		opts.compiler = options.compiler;
	}

	compile(opts, function(err) {
		log.error(err);
	});

	fs.unlinkSync(input);

	if (fs.existsSync(file.path)) {
		fs.unlinkSync(file.path);
	}

	log.debug('preprocessed "%s"', file.originalPath);

	fs.readFile(output, 'utf8', function(error, content) {
		if (error) {
			callback(error, null);
			return;
		}
		fs.unlinkSync(output);
		if (fs.existsSync(file.path)) {
			fs.unlinkSync(file.path);
		}
		callback(null, content);
	});
}

createTypeScriptPreprocessor.$inject = ['args', 'config.typescriptPreprocessor', 'logger', 'helper'];

// PUBLISH DI MODULE
module.exports = {
	'preprocessor:typescript': ['factory', createTypeScriptPreprocessor]
};
