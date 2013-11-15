var tsc = require('../lib/tsc.js');
tsc(__dirname + '/hello.ts', null,
	{
		sourceMap: true
	}, function(error, result) {
		if (error) throw error;
		console.log(result);
	});