var fs = require('fs')
  , vm = require('vm');

var load = function(file) {
  // console.log("================= load file with name :: " + file)
  var file_data = fs.readFileSync(file);
  // Run the file in this context
  vm.runInThisContext(file_data);
  // No exception thrown return true
  return true;
}

exports.load = load;