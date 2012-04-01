
var youtube = require('./youtube');

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
