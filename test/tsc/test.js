var tsc = require('../../lib/tsc.js');
tsc(__dirname + '/hello.ts', null,
	{
		sourceMap: true,
		target: 'ES5'
	}, function(error, result) {
		if (error) throw error;
		console.log(result);
	});