var Sync = require('../build/Release/sync').Sync;

/**
 * Retrieve the server information for the current
 * instance of the db client
 *
 * @ignore
 */
exports.setUp = function(callback) {
  callback();
}

/**
 * Retrieve the server information for the current
 * instance of the db client
 *
 * @ignore
 */
exports.tearDown = function(callback) {
  callback();
}

var test_function = function(callback) {
  console.log("============================= test_function")
  // console.dir(callback)
  process.nextTick(function() {
    console.log("============================= test_function 1")
    callback(null, {value:"true"});
  });
}

exports['Should correctly execute function using sync'] = function(test) {
  var sync = new Sync();
  var t = sync.execute(test_function, this);    
  console.log("================= hey")
  console.dir(t)
  test.done();
}