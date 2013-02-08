#include <stdarg.h>
#include <cstdlib>
#include <cstring>
#include <string.h>
#include <stdlib.h>

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunused-parameter"
#endif

#include <v8.h>

// this and the above block must be around the v8.h header otherwise
// v8 is not happy
#ifdef __clang__
#pragma clang diagnostic pop
#endif

#include <node.h>
#include <node_version.h>
#include <node_buffer.h>

#include <cmath>
#include <iostream>
#include <limits>
#include <vector>

#ifdef __sun
  #include <alloca.h>
#endif

#include <pthread.h>

#include "sync.h"
#include <uv.h>

using namespace v8;
using namespace node;

Persistent<FunctionTemplate> Sync::constructor_template;

static Handle<Value> VException(const char *msg) {
  HandleScope scope;
  return ThrowException(Exception::Error(String::New(msg)));
}

Sync::Sync() : ObjectWrap() {
}

void Sync::Initialize(v8::Handle<v8::Object> target) {
  // Grab the scope of the call from Node
  HandleScope scope;
  // Define a new function template
  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  constructor_template = Persistent<FunctionTemplate>::New(t);
  constructor_template->InstanceTemplate()->SetInternalFieldCount(1);
  constructor_template->SetClassName(String::NewSymbol("Sync"));

  // Instance methods
  NODE_SET_PROTOTYPE_METHOD(constructor_template, "execute", Execute);

  // Set the class name
  target->ForceSet(String::NewSymbol("Sync"), constructor_template->GetFunction());
}

// Create a new instance of BSON and passing it the existing context
Handle<Value> Sync::New(const Arguments &args) {
  HandleScope scope;

  Sync *sync = new Sync();
  sync->Wrap(args.This());
  return args.This();
}

Handle<Value> Sync::Execute(const Arguments &args) {
  HandleScope scope;

  if(args.Length() < 2) return VException("Function and context must be first two parameters");
  if(!args[0]->IsFunction()) return VException("First parameter must be a Function");

  Handle<Object> _context = args[1]->ToObject();

  v8::Persistent<v8::Function> function;
  function = v8::Persistent<v8::Function>::New(Handle<Function>::Cast(args[0]));

  // Create a new context.
  Persistent<Context> context = Context::New();
  Context::Scope context_scope(context);

  Handle<v8::Object> global = context->Global();  

  Handle<String> source = String::New("var return_value = null; function my_callback(err, result) { return_value = {err: err, result: result }; }");
  // printf("======================================== 3\n");
  Handle<Script> script = Script::Compile(source);
  // printf("======================================== 4\n");
  Handle<Value> result = script->Run();
  context.Dispose();

  // Handle<v8::Object> global = context->Global();
  Handle<v8::Value> value = global->Get(String::New("my_callback"));
  Handle<Function> func = v8::Handle<v8::Function>::Cast(value);
  // v8::Persistent<v8::Function> func;
  // func = v8::Persistent<v8::Function>::New(v8::Handle<v8::Function>::Cast(value));

  // Handle<Value> _args[2];
  Handle<Value> js_result;
  // // int final_result;  
  // printf("======================================== 2\n");

  // _args[0] = v8::String::New("1");
  // _args[1] = v8::String::New("1"); 
  // js_result = func->Call(global, 2, _args); 


  Handle<Value> _args[1];
  _args[0] = value;
  _args[0] = func;
  js_result = function->Call(global, 1, _args); 
  // function->
  
  js_result = global->Get(String::New("return_value"));

  while(js_result->IsNull()) {
    // Run event loop for a tick
    uv_run_once(uv_default_loop());    
    // Check for return value
    js_result = global->Get(String::New("return_value"));
  }

  // if(js_result->IsNull()) {
  //   printf("======== is null\n");
  //   // sleep(1);
  //   // 
  // }

  // uv_run_once(uv_default_loop());

  // js_result = global->Get(String::New("return_value"));

  // if(js_result->IsNull()) {
  //   printf("======== is null\n");
  //   // sleep(1);
  //   // 
  // }

  // pthread_yield_np();

  // context->Get(String::New("return_value"));
  // js_result = String::New

  // node::MakeCallback(_context, "", int argc, v8::Handle<v8::Value> *argv)

  // // Handle<Function> function = Handle<Function>::Cast(args[0]);
  // v8::Persistent<v8::Function> function;
  // function = v8::Persistent<v8::Function>::New(Handle<Function>::Cast(args[0]));

  // Handle<Object> _context = args[1]->ToObject();
  // // Handle<Object> command = args[2]->ToObject();
  // printf("======================================== 0\n");
  // // Create a new context.
  // Persistent<Context> context = Context::New();
  // printf("======================================== 1\n");
  // // Enter the context
  // Context::Scope context_scope(context);
  // printf("======================================== 2\n");
  // // We need to create a new callback handler that we will execute
  // Handle<String> source = String::New("function callback(err, result) { return {err: err, result: result }; }");
  // printf("======================================== 3\n");
  // Handle<Script> script = Script::Compile(source);
  // printf("======================================== 4\n");
  // Handle<Value> result = script->Run();
  // printf("======================================== 5\n");

  // printf("======================================== 1\n");
  // // Dispose of context
  // context.Dispose();

  // Handle<v8::Object> global = context->Global();
  // Handle<v8::Value> value = global->Get(String::New("callback"));
  // Handle<v8::Function> func = v8::Handle<v8::Function>::Cast(value);
  // printf("======================================== 2\n");

  // Handle<Value> _args[1];
  // Handle<Value> js_result;

  // // _args[0] = command;
  // _args[1] = func;
  // printf("======================================== 3\n");
  // js_result = function->Call(_context, 1, _args);
  // printf("======================================== 4\n");


  // Handle<Value> _args[2];
  // Handle<Value> js_result;
  // int final_result;  
  // printf("======================================== 2\n");

  // _args[0] = v8::String::New("1");
  // _args[1] = v8::String::New("1"); 
  // js_result = func->Call(global, 2, _args); 

  // String::AsciiValue ascii(js_result);
  // // final_result = atoi(*ascii);
  // // std::cout << ascii.length();
  // printf("%s\n", *ascii);
  // printf("======================================== 3\n");

  return scope.Close(js_result);
}


