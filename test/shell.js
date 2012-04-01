
var shell = require('../shell');

exports['exec'] = function (test) {
	test.expect(1);
	shell.exec('ls ' + __dirname + '/shell.js', function (err, stdout) {
		test.ok(~stdout.indexOf('shell.js'), 'shell.js not found');
		test.done();
	});
};

exports['exec with args'] = function (test) {
	test.expect(2);
	shell.exec([ 'ls', '-l', __dirname + '/shell.js' ], function (err, stdout) {
		test.ok(~stdout.indexOf('shell.js'), 'shell.js not found');
		test.ok(stdout.indexOf('-r') === 0, 'extra arguments not passed to ls');
		test.done();
	});
};
