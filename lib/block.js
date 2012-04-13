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
      } else if(lang !== 'en'){
        result = loadPage('en');
      }
    }
    cache[lang] = result;
  }
  return result;
}

function findPage(languages) {
  languages = languages.toLowerCase().split(',');
  for(var i = 0; i < languages.length; i++){
    var lang = languages[i].replace(/;.+/,''),
        result = loadPage(lang);

    if(result) return result;
  }
}

/**
 * options
 *     func
 *     text
 *     html
 *     agent: name or pattern, could be array
 *        IE IE[678910]
 *        google
 *        baidu
 *
 */
module.exports = function(options){

  var agent;

  if(typeof options == 'function') {
    options = {func: options};
  } else if(typeof options == 'string' || options instanceof RegExp) {
    agent = options
    options = {}
  } else {
    agent = options.agent;
  }

  function getPattern(agent) {
    var pattern;
    if(agent instanceof RegExp){
      return agent;
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
    } else if('google' == agent) {
      pattern = /googlebot/i
    } else if('baidu' == agent) {
      pattern = /Baiduspider/i
    } else {
      console.error('wrong agent options of connect-block');
    }
    return pattern;
  }



  if(agent) {
    var patterns;
    if(Array.isArray(agent)) {
      patterns = agent.map(getPattern);
    } else {
      patterns = [getPattern(agent)];
    }
    patterns = patterns.filter(function(p) {return p});
    var __match = String.prototype.match;
    options.func = function (req) {
      return patterns.some(__match, req.headers['user-agent']);
    }
  }

  /**
   * options
   *     text
   *     html
   *     func
   */
  var isBlock = options.func;
  var text = options.text || options.html;
  var headers = (options.text == null) ? {} : {
    'content-type' : 'text/html; charset=utf-8'
  };

  // return function(req, res, next) {next();}

  return function(req, res, next) {
    if(isBlock(req)) {
      res.writeHead(406, 'Agent is not supported', headers);
      if(text) {
        res.end(text, 'utf-8');
      } else {
        res.end(findPage(req.headers['accept-language']), 'utf-8');
      }
    } else {
      next();
    }
  }
}
