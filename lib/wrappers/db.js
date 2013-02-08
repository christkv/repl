// var Future = require('fibers/future')
//     , wait = Future.wait
//     , Fiber = require('fibers');

var Db = function(sync, db) {
  this.sync = sync;
  this.db = db;
}

Db.prototype.runCommand = function(command) {
  var final_command = {};
  if(typeof command == "string") {
    final_command = {};
    final_command[command] = true;
  } else {
    final_command = command;
  }

  // console.log("=============================== running command")
  // console.dir(final_command)

    // Fiber(function() {
    //   console.log("============================================= 0")
    //   test_function_2 = Future.wrap(test_function);
    //   console.log("============================================= 1")
    //   var result = test_function_2().wait();
    //   console.log("============================================= 2")
    //   console.dir(result)
    // }).run();

// function fibo (n) {
//   return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
// }

// function cb (err, data) {
//   process.stdout.write(data);
//   this.eval('fibo(35)', cb);
// }

// var thread= require('threads_a_gogo').create();

// console.log("================================= 0")
// thread.eval(fibo).eval('fibo(35)', cb);

  // var r = Fiber(function() {
  //   var executeDbCommand = Future.wrap(this.db.executeDbCommand);
  //   var result = executeDbCommand(final_command).wait();
  // }).run();

  // console.dir(r)

  // Execute the db command in sync mode
  var result = this.sync.execute(this.db.executeDbCommand, this.db, final_command);  
  // this.db.executeDbCommand(final_command, function(err, result) {
  //   console.log("============== result")
  //   console.dir(err)
  //   console.dir(result)
  // });
}

exports.Db = Db;