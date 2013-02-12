sai.pkg("sai", function(parents){

  return {
    'name'         : 'tsume',
    'main'         : undefined,
    'mainModuleId' : 'index',
    'modules'      : [],
    'parents'      : parents
  };

})({ 'index': function(module, exports, global, require, undefined){
  exports.tsume = true;

}, 

 });
