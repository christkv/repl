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

  console.log("=============================== running command")
  console.dir(final_command)

  // Execute the db command in sync mode
  var result = this.sync.execute(db.executeDbCommand, final_command);  
}

exports.Db = Db;