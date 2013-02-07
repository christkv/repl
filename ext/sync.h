//===========================================================================

#ifndef SYNC_H_
#define SYNC_H_

//===========================================================================

#include <node.h>
#include <node_object_wrap.h>
#include <v8.h>

using namespace v8;
using namespace node;

//===========================================================================
class Sync : public ObjectWrap {
public:    
  Sync();
  ~Sync() {}

  static void Initialize(Handle<Object> target);

  static Handle<Value> Execute(const Arguments &args);

  // Constructor used for creating new BSON objects from C++
  static Persistent<FunctionTemplate> constructor_template;

private:
  static Handle<Value> New(const Arguments &args);
};

#endif  // SYNC_H_

//===========================================================================
// Exporting function
extern "C" void init(Handle<Object> target)
{
  HandleScope scope;
  Sync::Initialize(target);
}

NODE_MODULE(sync, Sync::Initialize);
