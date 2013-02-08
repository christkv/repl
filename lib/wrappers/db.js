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

  // Execute the db command in sync mode
  var result = this.sync.execute(this.db.executeDbCommand, this.db, final_command);  
  if(result.err) {
    return result.err;
  } else {
    return result.result.documents[0];
  }
}

exports.Db = Db;