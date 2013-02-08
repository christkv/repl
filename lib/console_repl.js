var repl = require('repl')
  , format = require('util').format
  , MongoClient = require('mongodb').MongoClient
  , Db = require('./wrappers/db').Db
  , Sync = require('../build/Release/sync').Sync
  , Stream = require('stream')
  , load = require('./wrappers/load').load
  , assert = require('./wrappers/assert').assert;

ConsoleRepl = function ConsoleRepl(options) {
  this.options = options;
  this.sync = new Sync();

  // Split out the db name if specified
  if(this.options.host.match(/\//) != null) {
    this.options.db_name = this.options.host.split(/\//)[1];
    this.options.host = this.options.host.split(/\//)[0];
  } else {
    this.options.db_name = "test";    
  }

  // Create connection url
  this.options.url = format("mongodb://%s:%s/%s"
    , this.options.host
    , this.options.port
    , this.options.db_name);
  
  // Global context
  this.global = global;
}

ConsoleRepl.prototype.start = function() {
  // Our script context
  var scope = {};
  var self = this;
  // console.dir(this.options)

  console.log("MongoDB shell version: 0.0.1 - node");
  console.log(format("connecting to %s", this.options.db_name));

  MongoClient.connect(this.options.url, function(err, db) {
    if(err) throw err;

    // Our db command
    this.global.db = new Db(self.sync, db);
    // The load command
    this.global.load = load;
    this.global.print = console.log;
    this.global.assert = assert;

    // Custom eval loop
    function custom_eval(cmd, context, filename, callback) {
      callback(null, result);
    }

    repl.start({
        prompt: ">"
      , global: true
    });
  });
}

exports.ConsoleRepl = ConsoleRepl;