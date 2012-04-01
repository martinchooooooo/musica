// Implements a function queue, in which only one function may be running at a time.
var queue = (function () {
	var bind = function (fn, context) {
		return function () {
			return fn.call(context, arguments);
		};
	};

	var Queue = function (capacity) {
		this.items = [];
		this.capacity = capacity || 0;
	};
	// Adds a function to the queue.
	// `fn` is a function that accepts a callback parameter `donecallback`.
	// `donecallback` MUST be called when the function is complete.
	Queue.prototype.add = function (fn, context) {
		if (this.capacity > 0 && this.items.length >= this.capacity) return;
		this.items.push({ fn: fn, context: context });	
		if (this.items.length === 1) this.next();
	};
	Queue.prototype.next = function () {
		if (!this.items.length) return;
		// When the client function is done, it fires this callback,
		// which removes it from the queue and starts the next function.
		var callback = bind(function () {
			this.items.shift();
			this.next();
		}, this);
		var item = this.items[0];
		item.fn.call(item.context, callback);
	};
	Queue.prototype.shift = function () {
		if (!this.items.length) return;
		this.items.shift();
		this.next();
	};
	Queue.prototype.pop = function () {
		if (!this.items.length) return;
		this.items.pop();
	};
	
	var create = function (capacity) {
		return new Queue(capacity);
	};

	// Returns a queueable function that simply acts as a trigger for the specified `callback`. Useful for events that you want to fire at a certain point in the queue.
	var triggerFor = function (callback, context) {
		return function (done) {
			callback.call(context);
			done();
		};
	};

	// Returns a queueable function that delays the rest of the queue by the specified number of milliseconds.
	var delay = function (time) {
		return function (done) {
			return setTimeout(done, time);
		};
	};

	var module = {
		create: create,
		triggerFor: triggerFor,
		delay: delay
	};
	if (typeof exports !== 'undefined') {
		exports.create = create;
		exports.triggerFor = triggerFor;
		exports.delay = delay;
	}
	else return module;
}());
