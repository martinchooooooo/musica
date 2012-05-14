
var youtube = require('./youtube');

// Crawls youtube for video IDs returned from string `query`, and finds the first mp3 link that matches any of those video ids.
var crawlForYoutubeLink = function (query, callback) {
	youtube.searchVideos(query, function (videoIds) {
		if (!videoIds || !videoIds.length) return callback();
		youtube.getFirstMp3LinkForVideos(videoIds, function (link) {
			if (!link) return callback();
			callback(link);
		});
	});
};

exports.crawlForLink = crawlForYoutubeLink;
