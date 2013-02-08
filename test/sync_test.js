var Sync = require('../build/Release/sync').Sync
  , MongoClient = require('mongodb').MongoClient;

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

var test_function = function(test, test2, callback) {
  console.log("============================= test_function")
  // callback(null, {});
  MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
    console.log("=========================== hello :: " + test + " :: " + test2);
  //   if(err) return callback(err);
    // return callback(null, true);
    var collection = db.collection('testing');
    collection.insert({a:1}, function(err, result) {
      if(err) return callback(err);

      collection.findOne(function(err, item) {
        db.close();
        callback(err, item);
      });
    });
  });
  // console.dir(callback)
  // process.nextTick(function() {
  //   console.log("============================= test_function 1")
  //   callback(null, {value:"true"});
  // });
}

exports['Should correctly execute function using sync'] = function(test) {
  var sync = new Sync();
  var t = sync.execute(test_function, this, 1, "world");    
  console.log("================= hey")
  console.dir(t)
  test.done();
}