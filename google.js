
var dom = require('./dom');
var _ = require('underscore');

var baseUrl = 'http://www.google.com.au/search?q={query}';
var ua = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/535.11 (KHTML, like Gecko) Ubuntu/12.04 Chromium/17.0.963.83 Chrome/17.0.963.83 Safari/535.11';

var searchResults = function (query, callback) {
	var url = baseUrl.replace('{query}', query.replace(/ /g,'+'));
	dom.loadDOMAtUrl(url, function (doc) {
		var links = Array.prototype.slice.call(doc.querySelectorAll('a.l')).map(function (link) { return link.getAttribute('href'); });
		callback(links);
	}, { 'User-agent': ua });
};

exports.searchResults = searchResults;
