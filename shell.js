
var child_process = require('child_process');
var _ = require('underscore');

var exec = function (cmd, callback) {
	if (_.isArray(cmd)) cmd = cmd.join(' ');
	return child_process.exec(cmd, callback);
};

var escapeCmd = function (cmd) {
	return '"' + cmd + '"';
};

exports.exec = exec;
exports.escapeCmd = escapeCmd;
