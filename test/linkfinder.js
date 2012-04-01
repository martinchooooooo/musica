
var linkfinder = require('../linkfinder');
var fileserializer = require('../fileserializer');
var queue = require('../queue');
var fs = require('fs');
var lastfm = require('../lastfm');

/*
exports['find links for track'] = function (test) {
	var track = {
		name: 'The High Road',
		artist: 'Broken Bells'
	};
	var stream = fs.createWriteStream('data/results.txt');
	stream.once('open', function () {
		linkfinder.crawlForLink(track.name + ' ' + track.artist, function (link) {
			console.log('found link:',link);
			stream.write(link + '\t' + track.artist + '\t' + track.name + '\n'); 
			test.done();
		});
	});
};

exports['find links for top chart tracks'] = function (test) {
	var stream = fs.createWriteStream('data/results.txt');
	var myQueue = queue.create();
	stream.once('open', function () {
		lastfm.getTopTracks(10, function (tracks) {
			tracks.forEach(function (track) {
				myQueue.add(function (done) {
					console.log(track.artist + ' - ' + track.name);
					linkfinder.crawlForLink(track.name + ' ' + track.artist, function (link) {
						if (!link) {
							console.log('\tno link found.');
							return done();
						}
						console.log('\tfound:',link);
						stream.write(link + '\t' + track.artist + '\t' + track.name + '\n'); 
						done();
					});
				});
			});
			myQueue.add(queue.triggerFor(test.done, test));
		});
	});
};
*/

exports['find links for all tracks from data/suggestions.txt'] = function (test) {
	var stream = fs.createWriteStream('data/results.txt');
	stream.once('open', function () {
		var myQueue = queue.create();
		fileserializer.readTabDelimited('data/suggestions.txt', ['name', 'artist'], function (tracks) {
			tracks.forEach(function (track) {
				myQueue.add(function (done) {
					console.log(track.artist + ' - ' + track.name);
					linkfinder.crawlForLink(track.name + ' ' + track.artist, function (link) {
						if (!link) {
							console.log('\tno link found.');
							return done();
						}
						console.log('\tfound:',link);
						stream.write(link + '\t' + track.artist + '\t' + track.name + '\n'); 
						done();
					});
				});
			});
			myQueue.add(queue.triggerFor(test.done, test));
		});
	});
};
