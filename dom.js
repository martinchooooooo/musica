
var request = require('request');
var jsdom = require('jsdom');

// Uses jsdom to load the javascript DOM at `url`, enabling the QuerySelector feature. Fires `callback(doc, url)` where doc is the document object.
var loadDOMAtUrl = function (url, callback, headers) {
	request({uri: url, headers: headers}, function(error, response, body){
		if(!error && response.statusCode == 200){
			var doc = jsdom.jsdom(body, null, { features: { FetchExternalResources: false, ProcessExternalResources: false, QuerySelector: true } });
			callback(doc, url);
		}
	});
};

exports.loadDOMAtUrl = loadDOMAtUrl;
