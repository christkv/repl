var exampleProject = (function(){

  var pkgmap        = {},
      global        = {},
      nativeRequire = typeof require != 'undefined' && require,
      lib, ties, main, async;

  function exports(){ return main(); };

  exports.main     = exports;
  exports.module   = module;
  exports.packages = pkgmap;
  exports.pkg      = pkg;
  exports.require  = function require(uri){ return pkgmap.main.index.require(uri); };


  ties             = {"pi": Math.PI, "json": JSON};

  aliases          = {"sibling-alias":"sibling","dependency-alias":"dependency"};


  return exports;

function join() {
  return normalize(Array.prototype.join.call(arguments, "/"));
};

function normalize(path) {
  var ret = [], parts = path.split('/'), cur, prev;

  var i = 0, l = parts.length-1;
  for (; i <= l; i++) {
    cur = parts[i];

    if (cur === "." && prev !== undefined) continue;

    if (cur === ".." && ret.length && prev !== ".." && prev !== "." && prev !== undefined) {
      ret.pop();
      prev = ret.slice(-1)[0];
    } else {
      if (prev === ".") ret.pop();
      ret.push(cur);
      prev = cur;
    }
  }

  return ret.join("/");
};

function dirname(path) {
  return path && path.substr(0, path.lastIndexOf("/")) || ".";
};

function findModule(workingModule, uri){
  var moduleId      = join(dirname(workingModule.id), uri).replace(/\.js$/, ''),
      moduleIndexId = join(moduleId, 'index'),
      pkg           = workingModule.pkg,
      module;

  var i = pkg.modules.length,
      id;

  while(i-->0){
    id = pkg.modules[i].id;
    if(id==moduleId || id == moduleIndexId){
      module = pkg.modules[i];
      break;
    }
  }

  return module;
}

function newRequire(callingModule){
  function require(uri){
    var module, pkg;

    if(/^\./.test(uri)){
      module = findModule(callingModule, uri);
    } else if ( ties && ties.hasOwnProperty( uri ) ) {
      return ties[uri];
    } else if ( aliases && aliases.hasOwnProperty( uri ) ) {
      return require(aliases[uri]);
    } else {
      pkg = pkgmap[uri];

      if(!pkg && nativeRequire){
        try {
          pkg = nativeRequire(uri);
        } catch (nativeRequireError) {}

        if(pkg) return pkg;
      }

      if(!pkg){
        throw new Error('Cannot find module "'+uri+'" @[module: '+callingModule.id+' package: '+callingModule.pkg.name+']');
      }

      module = pkg.index;
    }

    if(!module){
      throw new Error('Cannot find module "'+uri+'" @[module: '+callingModule.id+' package: '+callingModule.pkg.name+']');
    }

    module.parent = callingModule;
    return module.call();
  };


  return require;
}


function module(parent, id, wrapper){
  var mod    = { pkg: parent, id: id, wrapper: wrapper },
      cached = false;

  mod.exports = {};
  mod.require = newRequire(mod);

  mod.call = function(){
    if(cached) {
      return mod.exports;
    }

    cached = true;

    global.require = mod.require;

    mod.wrapper(mod, mod.exports, global, global.require);
    return mod.exports;
  };

  if(parent.mainModuleId == mod.id){
    parent.index = mod;
    parent.parents.length === 0 && ( main = mod.call );
  }

  parent.modules.push(mod);
}

function pkg(/* [ parentId ...], wrapper */){
  var wrapper = arguments[ arguments.length - 1 ],
      parents = Array.prototype.slice.call(arguments, 0, arguments.length - 1),
      ctx     = wrapper(parents);


  pkgmap[ctx.name] = ctx;

  arguments.length == 1 && ( pkgmap.main = ctx );

  return function(modules){
    var id;
    for(id in modules){
      module(ctx, id, modules[id]);
    }
  };
}


}(this));

exampleProject.pkg("example-project", function(parents){

  return {
    'name'         : 'dependency',
    'main'         : undefined,
    'mainModuleId' : 'f',
    'modules'      : [],
    'parents'      : parents
  };

})({ 'f': function(module, exports, global, require, undefined){
  require('subdependency');
exports.parent = module.parent;
exports.f = true;

}, 



'g': function(module, exports, global, require, undefined){
  exports.g = true;

}, 

 });


exampleProject.pkg(function(parents){

  return {
    'name'         : 'example-project',
    'main'         : undefined,
    'mainModuleId' : 'a',
    'modules'      : [],
    'parents'      : parents
  };

})({ 'a': function(module, exports, global, require, undefined){
  var mustacheSyntax = "{{ foobar }}";

module.exports = {
  'a':true,
  'dependency': require('dependency'),
  'now': +(new Date),
  'global':global,
  'mustacheSyntax': mustacheSyntax
};

}, 



'b': function(module, exports, global, require, undefined){
  exports.b = true;


}, 



'web': function(module, exports, global, require, undefined){
  console.log('this module will be working for only web browsers');


}, 

 });


exampleProject.pkg("dependency", function(parents){

  return {
    'name'         : 'fruits',
    'main'         : undefined,
    'mainModuleId' : 'index',
    'modules'      : [],
    'parents'      : parents
  };

})({ 'index': function(module, exports, global, require, undefined){
  module.exports = require('./lib/fruits');

}, 



'lib/fruits': function(module, exports, global, require, undefined){
  module.exports = ['apple', 'orange'];

}, 

 });


exampleProject.pkg("dependency", "example-project", function(parents){

  return {
    'name'         : 'sibling',
    'main'         : undefined,
    'mainModuleId' : 'n',
    'modules'      : [],
    'parents'      : parents
  };

})({ 'n': function(module, exports, global, require, undefined){
  
exports.n = true;
exports.p = require('./p');
exports.s = require('./s/t');


}, 



'p/index': function(module, exports, global, require, undefined){
  exports.p = true;
exports.index = true;

}, 



'p/r': function(module, exports, global, require, undefined){
  require('../s/t');
exports.r = true;

}, 



's/t': function(module, exports, global, require, undefined){
  exports.t = true;

}, 

 });


exampleProject.pkg("dependency", function(parents){

  return {
    'name'         : 'subdependency',
    'main'         : undefined,
    'mainModuleId' : 'i',
    'modules'      : [],
    'parents'      : parents
  };

})({ 'i': function(module, exports, global, require, undefined){
  require('sibling');
exports.i = true;

}, 

 });


exampleProject.pkg("dependency", function(parents){

  return {
    'name'         : 'vegetables',
    'main'         : undefined,
    'mainModuleId' : 'lib/index',
    'modules'      : [],
    'parents'      : parents
  };

})({ 'lib/index': function(module, exports, global, require, undefined){
  module.exports = ['tomato', 'potato'];

}, 

 });


exampleProject.pkg("dependency", function(parents){

  return {
    'name'         : 'vehicles',
    'main'         : undefined,
    'mainModuleId' : 'index',
    'modules'      : [],
    'parents'      : parents
  };

})({ 'index': function(module, exports, global, require, undefined){
  module.exports = require('./lib/vehicles');

}, 



'lib/vehicles': function(module, exports, global, require, undefined){
  module.exports = ['car', 'boat', 'truck'];

}, 

 });


if(typeof module != 'undefined' && module.exports ){
  module.exports = exampleProject;

  if( !module.parent ){
    exampleProject();
  }
}
