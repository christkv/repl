var Collection = require('./collection').Collection;

var Db = function(sync, db) {
  this._sync = sync;
  this._db = db;
}

Db.prototype.getCollection = function(name) {
  console.log("================= getCollection 2")
  var collection = this._db.collection('name');
  return new Collection(this._sync, collection);
} 

Db.prototype.runCommand = function(command) {
  var final_command = {};
  if(typeof command == "string") {
    final_command = {};
    final_command[command] = true;
  } else {
    final_command = command;
  }

  // Execute the db command in sync mode
  var result = this._sync.execute(this._db.executeDbCommand, this._db, final_command);  
  if(result.err) {
    return result.err;
  } else {
    return result.result.documents[0];
  }
}

// function ( arg ){
// var q = {}
// if ( arg ) {
// if ( typeof( arg ) == "object" )
// Object.extend( q , arg );
// else if ( arg )
// q["$all"] = true;
// }
// return this.$cmd.sys.inprog.findOne( q );
// }

Db.prototype.currentOp = function(arg) {
  var q = {}
  
  if(arg){    
    if(typeof arg == 'object' ) {
      for(var key in arg) {
        q[key] = arg[key];
      }
    } else if(typeof arg == 'boolean') {
      q['$all'] = true;
    }
  }

  // Get the collection we are executing against
  var collection = this._db.collection("$cmd.sys.inprog");

  // Execute the db command in sync mode
  var result = this._sync.execute(collection.findOne, collection, q);  
  if(result.err) {
    return result.err;
  } else {
    return result.result;
  }    
}

exports.Db = Db;