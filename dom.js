
var request = require('request');
var jsdom = require('jsdom');

var loadDOMAtUrl = function (url, callback, headers) {
	request({uri: url, headers: headers}, function(error, response, body){
		if(!error && response.statusCode == 200){
			var doc = jsdom.jsdom(body, null, { features: { FetchExternalResources: false, ProcessExternalResources: false, QuerySelector: true } });
			callback(doc, url);
		}
	});
};

exports.loadDOMAtUrl = loadDOMAtUrl;
