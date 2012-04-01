
var suggester = require('../suggester');
var fileserializer = require('../fileserializer');

exports['get suggestions for track'] = function (test) {
	fileserializer.readTabDelimited('data/songs.txt', ['name','artist'], function (tracks) {
		suggester.suggest(tracks, function (suggestions) {
			fileserializer.serializeTabDelimited(suggestions, 'data/suggestions.txt', function () {
				test.done();	
			});
		});
	});
};
