
var _ = require('underscore')._;
var http = require('http');
var request = require('request');

_.templateSettings = {
	interpolate: /\{(.+?)\}/g
};

var baseUrl = _.template('http://ws.audioscrobbler.com/2.0/?{params}&format=json&api_key=b25b959554ed76058ac220b7b2e0a026');

var serializeToKeyValueString = function (obj) {
	return _.map(obj, function (val, key) {
		return key + '=' + encodeURIComponent(val);
	}).join('&');
};

var get = function (params, callback) {
	var url = baseUrl({ params: serializeToKeyValueString(params) });
	// console.log(url);
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
