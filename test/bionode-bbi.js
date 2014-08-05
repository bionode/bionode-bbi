var bin = require('../src/binutils')
var bbi = require('../src/bbi')
var nf = require('../src/node-fetchable')
var data = require('./data')


var should = require('should')

require('mocha')

describe("Parse from URL", function() {
  this.timeout(1300000);
  var bb
  it("Can get bbi", function(done) {
    var url = 'http://www.biodalliance.org/datasets/tests/test-leap.bb'
    var file = new bin.URLFetchable(url)
    bbi.connectBBI(file).then(success).catch(failure)
    function success(result) {
      result.should.eql(data.test1)
      bb = result
      done()
    }
  })
  it("Can get bbi features", function(done) {
    bb.getUnzoomedView().fetch('chr1', 1, 100000000).then(success).catch(failure)
    function success(result) {
      result.should.eql(data.test2)
      done()
    }
  })
})

describe("Parse from local file", function() {
  this.timeout(1300000);
  var bb
  it("Can get bbi", function(done) {
    var file = new nf.NodeFetchable('./test/test-leap.bb')
    data.test1.data ={ blob: './test/test-leap.bb', opts: undefined }
    bbi.connectBBI(file).then(success).catch(failure)
    function success(result) {
      result.should.eql(data.test1)
      bb = result
      done()
    }
  })
  it("Can get bbi features", function(done) {
    bb.getUnzoomedView().fetch('chr1', 1, 100000000).then(success).catch(failure)
    function success(result) {
      result.should.eql(data.test2)
      done()
    }
  })
})

function failure(error) { console.error(error) }
