var tsc = require('./lib/tsc.js');
var path = require('path');

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
				done(result.js || result);
			});
		} catch(e) {
			log.error('%s\n  at %s', e.message, file.originalPath);
			return;
		}
	};
};

createTypeScriptPreprocessor.$inject = ['args', 'config.typescriptPreprocessor', 'logger', 'helper'];

// PUBLISH DI MODULE
module.exports = {
	'preprocessor:typescript': ['factory', createTypeScriptPreprocessor]
};
