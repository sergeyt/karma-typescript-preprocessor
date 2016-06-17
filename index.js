var path = require('path');

var createTypeScriptPreprocessor = function(args, config, logger, helper) {
	config = config || {};

	var log = logger.create('preprocessor.typescript');
	var defaultOptions = {};

	var transformPath = args.transformPath || config.transformPath || function(filepath) {
		return filepath.replace(/\.ts$/, '.js');
	};

	// compiler options
	var options = helper.merge(defaultOptions, args.options || {}, config.options || {});
	var ts = config.typescript || require('typescript');

	return function(content, file, done) {
		log.debug('Processing "%s".', file.originalPath);
		file.path = transformPath(file.originalPath);

		try {
			var output = ts.transpile(content, options, path.relative(process.cwd(), file.originalPath));
			done(null, output);
		} catch(e) {
			log.error('%s\n at %s\n%s', e.message, file.originalPath, e.stack);
			return done(e, null);
		}
	};
};

createTypeScriptPreprocessor.$inject = ['args', 'config.typescriptPreprocessor', 'logger', 'helper'];

// PUBLISH DI MODULE
module.exports = {
	'preprocessor:typescript': ['factory', createTypeScriptPreprocessor]
};
