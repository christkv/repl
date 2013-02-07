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

#include "sync.h"

using namespace v8;
using namespace node;

Persistent<FunctionTemplate> Sync::constructor_template;


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

Handle<Value> Sync::Execute(const Arguments &args)
{
  HandleScope scope;

  return scope.Close(Boolean::New(true));
}


