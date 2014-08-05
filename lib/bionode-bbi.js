// # bionode-bwa
// > A Node.js wrapper for the Burrow-Wheeler Aligner (BWA).
// >
// > doi: [?](?)
// > author: [Bruno Vieira](http://bmpvieira.com)
// > email: <mail@bmpvieira.com>
// > license: [MIT](https://raw.githubusercontent.com/bionode/bionode-bwa/master/LICENSE)
//
// ---
//
// ## Usage
// This module can be used in Node.js as described further below, or as a command line tool.
// Check https://github.com/lh3/bwa for a list of parameters that can be passed to bwa.
// Examples:
//
//     $ npm install -g bionode-bwa
//
//     # bionode-bwa [operation] [arguments...]
//     $ bionode-bwa mem reference.fasta.gz reads.fastq.gz alignment.sam SRR1509835.bwa

// var fs = require('fs')
// var zlib = require('zlib')
// var path = require('path')
// var spawn = require('child_process').spawn
var through = require('through2')
var dalibbi = require('../src/bbi.js')
var nf = require('../src/node-fetchable');

// var split = require('split')
// var debug = require('debug')('bionode-bbi')

module.exports = exports = BBI

// ## BWA
// Takes a BWA operation and returns a Stream that accepts arguments for it.
// For example, for ```mem```, arguments can be a string of space separated filenames
// like ```reference.fasta reads.fastq alignment.sam``` or an array with filenames or variables
// ```[referenceFasta, 'reads.fastq', outputPath]```.
// If the output for sam is omitted, the current directory will be used.
//
//     var bwa = require('bionode-bwa')
//     var mem = bwa('mem')
//     mem('ref.fasta.gz, reads.fastq.gz')
//     .on('data', console.log)
//     => { operation: 'mem',
//          status: 'processing',
//          reference: 'reference.fasta.gz',
//          progress: { total: 11355, current: 0, percent: 0 },
//          sequences: [ 'reads.fastq.gz' ],
//          sam: 'reads.sam' }
//        [...]
//        { operation: 'mem',
//          status: 'finished',
//          reference: 'reference.fasta.gz',
//          progress: { total: 11355, current: 11355, percent: 100 },
//          sequences: [ 'reads.fastq.gz' ],
//          sam: 'reads.sam' }
//
// A callback style can also be used:
//
//     var mem = bwa('mem -x pacbio')
//     mem([ref, reads, alignment], function(err, data) {
//       console.log(data)
//     })
//     => { operation: 'mem',
//          status: 'finished',
//          reference: 'reference.fasta.gz',
//          progress: { total: 11355, current: 11355, percent: 100 },
//          sequences: [ 'reads.fastq.gz' ],
//          sam: 'alignment.sam' }
//
// Or pipes, for example, from a file with just a list of string like ```reference.fasta reads.fastq alignment.sam``` .
//
//     var split = require('split')
//     var mem = bwa() // when operation is omitted, 'mem' is used as default
//     fs.createReadStream('filenamesList.txt')
//     .pipe(split())
//     .pipe(mem())
//     .on('data', console.log)


function BBI(params, callback) {
  var stream = through.obj(transform)
  console.log(params)
  console.log('dalibbi')
  // if (params) { stream.write(params); stream.end() }
  // if (callback) {
  //   var result
  //   stream.on('data', function(data) {
  //     result = data
  //   })
  //   stream.on('end', function() {
  //     callback(null, result)
  //   })
  //   stream.on('error', callback)
  // }
  return stream
}
function transform(obj, enc, next) {
  var self = this
  var file = new nf.NodeFetchable(obj, {start: 0, lenght: 511})
  console.log(file)
  dalibbi.connectBBI(file).then(gotConnected, failure).catch(failure)
  function gotConnected(connection) {
    console.log('connected')
    console.log('blah')
    var u = connection.getUnzoomedView()
    var t = u.fetch()
    console.log('buh')
    console.dir(Object.getPrototypeOf(u))
    console.log('fim')
    u.fetch('chr1', 1, 100000000)
    .then(gotFetched, failure).catch(failure)
    // connection._readChromTree().then(gotFetched, failure)
    // connection._readChromTree().fetch('chr1', 1, 100000000).then(gotFetched, failure)
    function gotFetched(data) {
      console.log('ola')
      console.log(data)
      self.push(data)
      next()
    }
  }
}


function failure(error) {
  console.log(error.stack)
}
