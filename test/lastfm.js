
var lastfm = require('../lastfm');

var printAllTracks = function (data) {
	data.forEach(function (track) {
		console.log(track.artist + ' - ' + track.name);
	});
};

exports['get top tracks'] = function (test) {
	test.expect(1);
	console.log('Top tracks:');
	lastfm.getTopTracks(10, function (data) { 
		test.ok(data[0].artist, 'No top track returned');
		printAllTracks(data);
		test.done();
	});
};

exports['get top tracks for artist'] = function (test) {
	test.expect(1);
	lastfm.getTopTracksForArtist('Hilltop Hoods', 2, function (data) { 
		test.equal(data[0].artist, 'Hilltop Hoods');
		test.done();
	});
};

exports['get track info'] = function (test) {
	test.expect(1);
	lastfm.getTrackInfo('believe', 'cher', function (track) { 
		test.equal(track.name, 'Believe');
		test.done();
	});
};

exports['get similar tracks'] = function (test) {
	test.expect(1);
	lastfm.getSimilarTracks('believe', 'cher', 2, function (data) { 
		test.equal(data[0].artist, 'Cher');
		test.done();
	});
};
