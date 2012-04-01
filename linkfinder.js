
var _ = require('underscore');
var queue = require('./queue');
var google = require('./google');
var youtube = require('./youtube');
var dom = require('./dom');

var getHulkshareLink = function (doc, url, callback) {
	console.log('\tloaded:',url);
	var meta = doc.querySelector('meta[property="og:audio"]');
	var link = meta && meta.getAttribute('content');
	// no remixes
	if (/remix/i.test(link) || /cover/i.test(link)) return callback();
	return callback(link);
};
var getMediaFireLink = function (doc, url, callback) {
	console.log('\tloaded:',url);
	var link = _.find(Array.prototype.slice.call(doc.getElementsByTagName('a')), function (lnk) {
		// no remixes
		var href = lnk.getAttribute('href');
		if (/remix/i.test(href) || /cover/i.test(href)) return false;
		return ~href.indexOf('.mp3') && ~lnk.innerHTML.indexOf('Download');
	});
	callback(link && link.getAttribute('href'));
};
var getKohitLink = function (doc, url, callback) {
	console.log('\tloaded:',url);
	var link = _.find(Array.prototype.slice.call(doc.getElementsByTagName('a')), function (lnk) {
		// no remixes
		if (/remix/i.test(lnk.getAttribute('href'))) return false;
		return ~lnk.getAttribute('href').indexOf('.mp3');
	});
	callback(link && link.getAttribute('href'));
};

var supported = [
	{ urlMatch: /hulkshare\.com/, fn: getHulkshareLink },
	{ urlMatch: /mediafire\.com/, fn: getMediaFireLink },
	{ urlMatch: /kohit\.net/, fn: getKohitLink }
];

var getLink = function (doc, url, callback) {
	return _.find(supported, function (s) {
		return url.match(s.urlMatch);
	}).fn(doc, url, callback);
};

var canGetLink = function (url) {
	return _.any(supported, function (s) {
		return url.match(s.urlMatch);
	});
};

var crawlForFileShareLink = function (query, callback) {
	var crawlerQueue = queue.create();
	google.searchResults(query, function (links) {
		var candidateLinks = _.filter(links, canGetLink);
		candidateLinks.forEach(function (candidateLink, index) {
			crawlerQueue.add(function (done) {
				dom.loadDOMAtUrl(candidateLink, function (doc, url) {
					getLink(doc, url, function (link) {
						if (link) {
							crawlerQueue.items = [crawlerQueue.items[0]];
							callback(link);
						}
						done();
					});
				});
			});
		});
		crawlerQueue.add(queue.triggerFor(callback));
	});
};

var crawlForYoutubeLink = function (query, callback) {
	youtube.searchVideos(query, function (videoIds) {
		if (!videoIds || !videoIds.length) return callback();
		youtube.getMp3LinkForVideo(videoIds[0], function (link) {
			if (!link) return callback();
			callback(link);
		});
	});
};

exports.crawlForLink = crawlForYoutubeLink;
exports.getLink = getLink;
exports.canGetLink = canGetLink;
