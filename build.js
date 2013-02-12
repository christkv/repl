var exec = require('child_process').exec
  , format = require('util').format
  , fs = require('fs');

function buildBundle(version, callback) {
  var file_name = format("output/node-%s/lib/mongo.js", version);
  var build_command = format("./tools/one/bin/onejs build package.json output/node-%s/lib/mongo.js", version);
  var third_party_file = format("output/node-%s/lib/_third_party_main.js", version);
  var copy_command = format("cp ext/node_sync.* output/node-%s/src", version);
  var node_gyp = format("output/node-%s/node.gyp", version);
  var node_file = format("output/node-%s/src/node.cc", version);
  var node_extensions = format("output/node-%s/src/node_extensions.h", version);

  exec(build_command, {}, function(error, stdout, stderr) {
    console.log(stdout)
    console.log(stderr)

    // Apply change to file for the sync library
    var file = fs.readFileSync(file_name, 'utf8');
    file = file.replace("require('../build/Release/sync')", "process.binding('sync')");
    fs.writeFileSync(file_name, file, 'utf8');

    // Create the _third_party_main.js file
    fs.writeFileSync(third_party_file, "require('mongo');", 'utf8');

    // Copy the c++ files over to the correct directory
    exec(copy_command, {}, function(error, stdout, stderr) {
      console.log(stdout)
      console.log(stderr)

      //
      // node.gyp
      // Modify the node.gyp file
      var node_gyp_data = fs.readFileSync(node_gyp, 'utf8');
      // Add the files to the gyp file
      node_gyp_data = node_gyp_data.replace("'library_files': [", "'library_files': ['lib/mongo.js','lib/_third_party_main.js',");
      node_gyp_data = node_gyp_data.replace("'sources': [", "'sources': ['src/node_sync.h', 'src/node_sync.cc',");
      // Write file back
      fs.writeFileSync(node_gyp, node_gyp_data, 'utf8');

      //
      // node.cc
      // Modify the node.cc file
      var node_cc = fs.readFileSync(node_file, 'utf8');
      // Add the node_sync header
      node_cc = node_cc.replace('#include "node.h"', "#include \"node.h\"\n#include \"node_sync.h\"");
      // Write file back
      fs.writeFileSync(node_file, node_cc, 'utf8');

      //
      // node_extensions.h
      // Modify the node_extensions.h file
      var node_extensions_data = fs.readFileSync(node_extensions, 'utf8');
      // Add the module
      node_extensions_data = node_extensions_data.replace("NODE_EXT_LIST_ITEM(node_fs_event_wrap)", "NODE_EXT_LIST_ITEM(node_fs_event_wrap)\nNODE_EXT_LIST_ITEM(node_sync)");
      // Write file back
      fs.writeFileSync(node_extensions, node_extensions_data, 'utf8');

      // Done
      callback(null);
    })
  });
}

function createBuildDirectory(callback) {
  exec('rm -rf output', {}, function(error, stdout, stderr) {
    exec('mkdir output', {}, function(error, stdout, stderr) {
      console.log(stdout)
      console.log(stderr)
      callback(null);
    });  
  });  
}

function checkoutNodeSource(version, callback) {
  var node_file = format("http://nodejs.org/dist/%s/node-%s.tar.gz", version, version);
  var curl_command = format("curl %s -o output/node-%s.tar.gz", node_file, version);
  var tar_comand = format("cd output; tar xvfz node-%s.tar.gz", version);
  console.log(curl_command)

  // Fetch node.js
  exec(curl_command, {}, function(error, stdout, stderr) {
    console.log(stdout)
    console.log(stderr)

    // Unpack the node js version
    exec(tar_comand, {}, function(error, stdout, stderr) {
      console.log(stdout)
      console.log(stderr)
      callback(null);
    });
  });  
}

createBuildDirectory(function() {  
  checkoutNodeSource("v0.8.19", function() {
    buildBundle("v0.8.19", function() {

    })
  })
})

// buildBundle("v0.8.19", function() {

// })


// buildBundle(function() {

// });
