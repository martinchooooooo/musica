
var fs = require('fs');
var _ = require('underscore');

// Serializes an array of objects (`records`) out to a tab-delimited file.
var serializeTabDelimited = function (records, file, callback) {
	var stream = fs.createWriteStream(file);
	stream.once('open', function (fd) {
		_.each(records, function (record) {
			stream.write((_.isArray(record) ? record : _.values(record)).join('\t') + '\n');
		});
		callback(fd);
	});
};

// Reads in a tab-delimited file `file` into an array of objects.
// `fieldnames` is an array that describes the column names in the file.
var readTabDelimited = function (file, fieldnames, callback) {
	fs.readFile(file, function(err, data){
		if (err) throw err;
		var records = _.compact(_.map(data.toString('utf-8').split('\n'), function (line) {
			if (!line) return;
			var record = {};
			_.each(_.zip(fieldnames, line.split('\t')), function (field) {
				record[field[0]] = field[1];
			});
			return record;
		}));
		callback(records);
	});
};

exports.serializeTabDelimited = serializeTabDelimited;
exports.readTabDelimited = readTabDelimited;
