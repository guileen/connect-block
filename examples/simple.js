var connect = require('connect'),
    block = require('../lib/block');

connect(
  block('IE8'),
  function(req, res){
    res.end('You have passed');
  }
).listen(3000);
