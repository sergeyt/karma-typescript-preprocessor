var _ = require('lodash');
var glob = require('glob');
var tss = require('typescript-simple');

var createTypeScriptPreprocessor = function(args, config, logger, helper) {
	config = config || {};

	var log = logger.create('preprocessor.typescript');
	var defaultOptions = {};
    
    var typingPatterns = [].concat(config.typings || []);
	var typings = _.flatten(typingPatterns.map(function (pattern) {
		return glob.sync(pattern);
	}));

	// compiler options
	var options = helper.merge(defaultOptions, args.options || {}, config.options || {});
    var compiler = new tss.TypeScriptSimple(options, true, typings);

	return function(content, file, done) {
		try {
			var output = compiler.compile(content, file.originalPath);
			done(output);
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
