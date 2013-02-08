var assert = function() {}

assert.eq = function(expected, actual, error_message) {
  if(expected != actual) throw error_message;
}

exports.assert = assert;