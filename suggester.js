
var _ = require('underscore');
var lastfm = require('./lastfm');
var queue = require('./queue');

var suggest = function (tracks, callback) {
	var suggestions = [];
	var lastfmQueue = queue.create();
	_.each(tracks, function (track) {
		lastfmQueue.add(function (done) {
			console.log(track.name, track.artist);
			lastfm.getSimilarTracks(track.name, track.artist, '10', function (data) {
				_.each(data, function (similarTrack) {
					suggestions.push(similarTrack);
				});
				done();
			});
		});
		// add a 1-sec delay to be nice to lastfm
		lastfmQueue.add(queue.delay(1));
	});
	lastfmQueue.add(queue.triggerFor(function () {
		// calculate frequency of each suggestion in the list
		_.each(suggestions, function (suggestion) {
			suggestion.frequency = _.filter(suggestions, function (s) {
				return s.name === suggestion.name && s.artist === suggestion.artist;
			}).length;
		});
		// sort by frequency, descending
		suggestions.sort(function (a, b) {
			return b.frequency - a.frequency;
		});
		// remove duplicate suggestions
		suggestions = _.unique(suggestions, false, function (track) { return track.name+'\t'+track.artist; });
		// remove suggestions that we already have
		suggestions = _.reject(suggestions, function (s) {
			return _.find(tracks, function (track) {
				return track.name.toLowerCase() === s.name.toLowerCase() && track.artist.toLowerCase() === s.artist.toLowerCase();
			});
		});
		// fire callback
		callback(suggestions);
	}));
};

_.extend(exports, {
	suggest: suggest
});
