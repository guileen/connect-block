var express = require('express'),
    block = require('../lib/block');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
    // block IE6, IE7, IE8
    app.use(block('IE8'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res){
    res.end('You have passed');
})

app.listen(3000);
