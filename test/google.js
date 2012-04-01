
var google = require('../google');

exports['get links on google'] = function (test) {
	google.searchResults('nickleback', function (links) {
		console.log(links);
		test.ok(links.length > 10, "not enough links returned");
		test.ok(~links[0].indexOf('nickelback'), "nickelback not in " + links[0]);
		test.done();
	});
};
