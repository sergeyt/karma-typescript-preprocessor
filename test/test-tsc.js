var tsc = require('../lib/tsc.js');
tsc(__dirname + '/hello.ts', __dirname + '/hello.js', {}, function(error, result){
	if (error) throw error;
	console.log(result);
});