var connect = require('connect'),
    block = require('./index');

connect(
  block('IE8'),
  function(req, res){
    res.end('You have passed');
  }
).listen(8000);
