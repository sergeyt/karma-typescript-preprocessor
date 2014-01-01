var fs = require('fs'),
	_ = require('lodash'),
	compile = require('node-tsc').compile;

module.exports = function(input, output, options, callback, log) {

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
};