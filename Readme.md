Best browser compatible solution!
========

A middleware for [connect](https://github.com/senchalabs/connect)

    var block = require('connect-block');
    connect(
        block('IE8'), //you can use IE, IE6, IE7, IE8, IE9, IE10 or RegExp
        function(req, res){
          res.end('You have passed.');
        }
    ).listen(3000);

If you you browse this page in IE6,IE7,IE8 you will got

<style>
  .blockagent a{
    text-decoration:none;
  }
  .blockagent a, .blockagent a:visited {
    color: yellow;
  }
  .blockagent a:hover {
    color: #ff00ff;
  }
</style>
<div class="blockagent" style="font-size: 20px; text-align: center; background: black; color: white;" >
  <p>Sorry! Your browser is not supported.</p>
  <p style="font-size: 30px">Choose another browser</p>
  <p>
  <a href="http://www.google.com/chrome/">Chrome<!--chrome icon--></a> | 
  <a href="http://www.mozilla.com/en-US/firefox/fx/">Firefox<!--chrome icon--></a> |
  <a href="http://www.apple.com/safari/">Safari<!--chrome icon--></a>
  </p>
</div>
