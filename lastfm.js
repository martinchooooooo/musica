
var _ = require('underscore')._;
var http = require('http');
var request = require('request');

_.templateSettings = {
	interpolate: /\{(.+?)\}/g
};

// Base URL for last.fm (API key taken from examples)
var baseUrl = _.template('http://ws.audioscrobbler.com/2.0/?{params}&format=json&api_key=b25b959554ed76058ac220b7b2e0a026');

var serializeToKeyValueString = function (obj) {
	return _.map(obj, function (val, key) {
		return key + '=' + encodeURIComponent(val);
	}).join('&');
};

// Sends `params` to last.fm service and fires `callback` with the JSON response 
var get = function (params, callback) {
	var url = baseUrl({ params: serializeToKeyValueString(params) });
	return request({ url: url }, function (error, response, body) {
		if (!error) {
			try {
				var data = JSON.parse(body);
			}
			catch (e) { return callback(); }
			callback(data);
		}
		else callback();
	});
};

var createTrack = function (name, artist) {
	return { name: name, artist: artist };
};

// Gets the top `limit` tracks for `artist`
var getTopTracksForArtist = function (artist, limit, callback) {
	return get({ method: 'artist.gettoptracks', limit: limit, artist: artist }, function (data) {
		if (!data || !data.toptracks || !_.isArray(data.toptracks.track)) {
			console.log('  no results.');
			return callback([]);
		}
		var tracks = _.map(toArray(data.toptracks.track), function (t) {
			return createTrack(t.name, t.artist.name);
		});
		return callback(tracks);
	});
};

// Gets top `limit` tracks on the chart.
var getTopTracks = function (limit, callback) {
	return get({ method: 'chart.gettoptracks', limit: limit }, function (data) {
		if (!data || !data.tracks || !_.isArray(data.tracks.track)) {
			console.log('  no results.');
			return callback([]);
		}
		var tracks = _.map(toArray(data.tracks.track), function (t) {
			return createTrack(t.name, t.artist.name);
		});
		return callback(tracks);
	});
};

// Gets track info for `track` by `artist`.
var getTrackInfo = function (track, artist, callback) {
	return get({ method: 'track.getinfo', track: track, artist: artist }, function (data) {
		if (!data || !data.track) {
			console.log('  no results.');
			return callback([]);
		}
		return callback(createTrack(data.track.name, data.track.artist.name));	
	});
};

var toArray = function (obj) {
	if (_.isArray(obj)) return obj;
	return [obj];
};

// Gets `limit` similar tracks to `track` by `artist`. Suggestions are handled by the last.fm API
var getSimilarTracks = function (track, artist, limit, callback) {
	return get({ method: 'track.getsimilar', track: track, artist: artist, limit: limit }, function (data) {
		if (!data || !data.similartracks || !_.isArray(data.similartracks.track)) {
			console.log('  no results.');
			return callback([]);
		}
		return callback(_.map(toArray(data.similartracks.track), function (t) {
			return createTrack(t.name, t.artist.name);
		}));
	});
};

_.extend(exports, {
	getTrackInfo: getTrackInfo,
	getTopTracks: getTopTracks,
	getTopTracksForArtist: getTopTracksForArtist,
	getSimilarTracks: getSimilarTracks,
	get: get
});
