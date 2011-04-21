module.exports = function(agent){
  var pattern;
  if(agent instanceof RegExp){
    pattern = agent;
  } else if('IE' === agent){
    pattern = /MSIE/
  } else if('IE6' === agent){
    pattern = /MSIE 6/
  } else if('IE7' === agent){
    pattern = /MSIE [67]/
  } else if('IE8' === agent){
    pattern = /MSIE [678]/
  } else if('IE9' === agent){
    pattern = /MSIE [6789]/
  } else if('IE10' === agent){
    pattern = /MSIE ([6789]|10)/
  } else {
    return function(req, res, next) {next();}
  }

  var cache = {},
      fs = require('fs');

  function loadPage(lang) {
    var result = cache[lang];
    if(!result){
      try{
        result = fs.readFileSync(__dirname + '/block.' + lang + '.html');
      } catch (e){
        if(lang.length > 2){
          result = loadPage(lang.substring(0,2));
        } else if(lang != 'en'){
          result = loadPage('en');
        }
      }
      cache[lang] = result;
    }
    return result;
  }

  function findPage(languages) {
    console.log('find '+languages);
    languages = languages.split(',');
    for(var i = 0; i < languages.length; i++){
      var lang = languages[i].replace(/;.+/,''),
          result = loadPage(lang);

      if(result) return result;
    }
  }

  return function(req, res, next) {
    if(req.headers['user-agent'].match(pattern)) {
      res.end(findPage(req.headers['accept-language']));
    } else {
      next();
    }
  }
}
