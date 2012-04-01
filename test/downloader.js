
var downloader = require('../downloader');
var fileserializer = require('../fileserializer');
var queue = require('../queue');

/*
exports['download single file'] = function (test) {
};
*/

var WGET_PROGRESS = /(\d+%).+ (\w+s)/;

var writeProgress = function (match) {
	process.stderr.write(match[1] + ' (' + match[2] + ' remaining)            \r'); 
};

exports['download tracks from data/results.txt'] = function (test) {
	var myQueue = queue.create();
	fileserializer.readTabDelimited('data/results.txt', ['url', 'artist', 'name'], function (tracks) {
		tracks.forEach(function (track) {
			myQueue.add(function (done) {
				console.log('downloading ' + track.name + ' from ' + track.url);
				var dload = downloader.download(track.url, '/home/hari/Music/download/' + track.artist + ' - ' + track.name + '.mp3', function () {
					done();
				});
				if (!dload) return;
				// wget prints out percentages somewhere in stderr, let's capture those
				dload.stderr.on('data', function (chunk) { 
					var m = chunk.match(WGET_PROGRESS);
					m && writeProgress(m);
				});
			});
		});
		myQueue.add(queue.triggerFor(test.done, test));
	});
};
