var logging        = require('../../logging'),
    objectName     = require('../object_name'),
    templates      = require('./templates');

function plain(pkg, options, callback){
  logging.info('Rendering %s', pkg.name);

  templates.wrapper({ 'name': objectName(pkg.name), 'content': pkg.modules[0].content }, function(error, bf){
    if(error){
      callback(error);
      return;
    }

    var ret = {};
    ret[options.save[pkg.name].to] = bf;

    callback(undefined, ret);

  });
}

module.exports = plain;
