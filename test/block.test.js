var block = require('../lib/block')
  , should = require('should');

function testBlock(middleware, agent, text, done){
  var req = {
    headers: {
      "user-agent" : agent
    }
  }

  var res = {
    writeHead: function(statusCode, statusText, headers) {
      statusCode.should.equal(406);
    }
  , end: function(text, encode){
      text.should.equal(text);
      if (done) done();
    }
  }

  var next = function(){
    throw new Error(agent + ' should be block');
  }

  middleware(req, res, next);
}

function testPass(middleware, agent, done) {

  var req = {
    headers: {
      "user-agent" : agent
    }
  }

  var res = {
    writeHead: function(statusCode, statusText, headers) {
      throw new Error(agent + 'should not pass');
    }
  , end: function(text, encode){
      throw new Error(agent + ' should not pass');
    }
  }

  var next = function(){
    if(done) done();
  }

  middleware(req, res, next);
}

describe('connnect-block', function(){
    describe('agent only', function(){

        it('should match google', function(done) {
            var middleware = block({agent:'google', text:'Goodbye'});
            testBlock(middleware, 'googlebot(at)googlebot.com', 'Goodbye', done)
        });

        it('should match any', function(done) {
            var middleware = block({agent: ['google', 'baidu', 'IE6'], text:'Goodbye'});

            testBlock(middleware, 'googlebot(at)googlebot.com', 'Goodbye');
            testBlock(middleware, 'Baiduspider', 'Goodbye');
            testBlock(middleware, 'blabla MSIE 6 blabla', 'Goodbye');
            testPass(middleware, 'Firefox', done)
        })
    })

});
