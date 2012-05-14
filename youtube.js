
var request = require('request');
var dom = require('./dom');
var queue = require('./queue');

var youtubemp3pushitem = 'http://www.youtube-mp3.org/api/pushItem/?item=';
var youtubemp3hash = 'http://www.youtube-mp3.org/api/itemInfo/?video_id=';
var youtubemp3get = 'http://www.youtube-mp3.org/get?video_id={id}&h={h}';

var youtubeWatch = 'http://www.youtube.com/watch?v=';

// Gets the hash for a youtube `videoId` that is required for validation against youtube-mp3.org.  
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

// Gets an mp3 link for a youtube `videoId`.
// Fires `callback` passing through the mp3 link as the `url` parameter.
var getMp3LinkForVideo = function (videoId, callback) {
	getVideoHash(videoId, function (hash) {
		if (!hash) return callback();
		var url = youtubemp3get.replace('{id}', videoId).replace('{h}', hash);
		callback(url);
	});
};

// Loops through `videoIds` and finds the first one that can be resolved as an mp3 link, and fires `callback` with the URL.
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

// Searches youtube given a string `query` (e.g "The Best of You Foo Fighters"), and fires `callback` with all the video ids in the search results
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
