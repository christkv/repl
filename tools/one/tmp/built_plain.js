var vegetables = (function(undefined){

  var exports = {}, module = { 'exports': exports };

  module.exports = ['tomato', 'potato'];


  return module.exports;

})();

if(typeof module != 'undefined' && module.exports){
  module.exports = vegetables;
};
