// from @bmpvieira

"use strict";

// Imports
var fs = require('fs');
var concat = require('concat-stream');

var Promise = require('es6-promise').Promise;

function NodeFetchable(blob, opts) {
    this.blob = blob;
    this.opts = opts;
}

NodeFetchable.prototype.slice = function(start, length) {
    // Both start and end are inclusive and start at 0 (http://nodejs.org/api/fs.html)
    var opts = {start: start};
    if (length) { opts.end = start + length - 1};
    return new NodeFetchable(this.blob, opts);
}

NodeFetchable.prototype.fetch = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        var read = fs.createReadStream(self.blob, self.opts);
        var write = concat(function(data) {
            resolve(toArrayBuffer(data));
        });
        read.pipe(write);
    });
}

function toArrayBuffer(buffer) {
    // Node 0.12+ has a built-in buffer.toArrayBuffer() method that will deprecate this
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

module.exports = {
    NodeFetchable: NodeFetchable
}

