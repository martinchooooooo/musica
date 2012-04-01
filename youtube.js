
var request = require('request');
var dom = require('./dom');
var queue = require('./queue');

var youtubemp3pushitem = 'http://www.youtube-mp3.org/api/pushItem/?item=';
var youtubemp3hash = 'http://www.youtube-mp3.org/api/itemInfo/?video_id=';
var youtubemp3get = 'http://www.youtube-mp3.org/get?video_id={id}&h={h}';

var youtubeWatch = 'http://www.youtube.com/watch?v=';
var pushVideo = function (videoId, callback) {
	var url = youtubemp3pushitem + encodeURIComponent(youtubeWatch + videoId);
	request({url: url}, function (error, response, body) {
		if (!error) {
			try {
				callback(body);
			}
			catch(e) { return callback(); }
		}
		else callback();
	});
};

var getVideoHash = function (videoId, callback) {
	var url = youtubemp3hash + videoId;
	request({url: url}, function (error, response, body) {
		if (!error) {
			try {
				var data = JSON.parse(body.split('info =')[1].replace(/;$/,''));
				callback(data.h);
			}
			catch(e) { return callback(); }
		}
		else callback();
	});
};

var getMp3LinkForVideo = function (videoId, callback) {
	// I'm not sure whether pushVideo is required
	//pushVideo(videoId, function (videoId) {
	//	if (!videoId) return callback();
		getVideoHash(videoId, function (hash) {
			if (!hash) return callback();
			var url = youtubemp3get.replace('{id}', videoId).replace('{h}', hash);
			callback(url);
		});
	//});
};

var getFirstMp3LinkForVideos = function (videoIds, callback) {
	var myQueue = queue.create();
	videoIds.forEach(function (videoId) {
		myQueue.add(function (done) {
			getMp3LinkForVideo(videoId, function (url) {
				if (url) {
					myQueue.items = [myQueue.items[0]];
					callback(url);
				};
				done();
			});
		});
	});
	myQueue.add(queue.triggerFor(callback));
};

var youtubeSearchUrl = 'http://www.youtube.com/results?search_query=';
var searchVideos = function (query, callback) {
	var url = youtubeSearchUrl + encodeURIComponent(query);
	dom.loadDOMAtUrl(url, function (doc) {
		var links = Array.prototype.slice.call(doc.querySelectorAll('div.result-item-main-content a')).filter(function (lnk) {
			return lnk.getAttribute('href').indexOf('/watch') === 0 && /v=(\w+)/.test(lnk.getAttribute('href')) && !/remix/i.test(lnk.innerHTML) && !/cover/i.test(lnk.innerHTML) && /live/i.test(lnk.innerHTML) == /live/i.test(query);
		}).map(function (lnk) {
			return lnk.getAttribute('href').match(/v=(\w+)/)[1];	
		});
		callback(links);
	});
};

exports.getMp3LinkForVideo = getMp3LinkForVideo;
exports.getFirstMp3LinkForVideos = getFirstMp3LinkForVideos;
exports.searchVideos = searchVideos;
