var Collection = function(sync, collection) {
  this._sync = sync;
  this._collection = collection;
}

Collection.prototype.drop = function() {
  // Execute the db command in sync mode
  var result = this._sync.execute(this._collection.drop, this._collection);  
  console.log("=================================== collection.drop")
  console.dir(result);
  if(result.err) {
    return result.err;
  } else {
    return result.result;
  }  
}

Collection.prototype.save = function(object) {
  // Execute the db command in sync mode
  var result = this._sync.execute(this._collection.save, this._collection, object);
  console.log("=================================== collection.save")
  console.dir(result);
  if(result.err) {
    return result.err;
  } else {
    return result.result;
  }    
}

Collection.prototype.findOne = function() {
  // Execute the db command in sync mode
  var result = this._sync.execute(this._collection.findOne, this._collection);
  console.log("=================================== collection.findOne")
  console.dir(result);
  if(result.err) {
    return result.err;
  }
  
  return result.result;
}

Collection.prototype.validate = function() {
  console.log("=================================== collection.validate")
  console.dir(result);
  var cmd = {validate: this._collection.collectionName };

  // Run validate command
  var result = this._sync.execute(this._collection.db.executeDbCommand, this._collection.db, cmd);
  if(result.err) {
    return result.err;
  }

  // Get the result
  var res = result.result.documents[0];
  // If we have the old style of the validate command
  if (typeof(res.valid) == 'undefined') {
    // old-style format just put everything in a string. Now using proper fields

    res.valid = false;
    var raw = res.result || res.raw;

    console.dir(raw)

    if(raw) {
      var str = "-" + JSON.stringify(raw);
      res.valid = ! ( str.match( /exception/ ) || str.match( /corrupt/ ) );

      var p = /lastExtentSize:(\d+)/;
      var r = p.exec( str );
    
      if ( r ) {
        res.lastExtentSize = Number( r[1] );
      }
    }
  }

  return res;
}

exports.Collection = Collection;