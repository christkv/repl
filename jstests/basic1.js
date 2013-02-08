
t = db.getCollection( "basic1" );
t.drop();

print("================ 0")

o = { a : 1 };
print("================ 1")
t.save( o );
print("================ 2")

assert.eq( 1 , t.findOne().a , "first" );
print("================ 3")
assert( o._id , "now had id" );
print("================ 4")
assert( o._id.str , "id not a real id" );
print("================ 5")

o.a = 2;
print("================ 6")
t.save( o );
print("================ 7")

assert.eq( 2 , t.findOne().a , "second" );
print("================ 8")

assert(t.validate().valid);
print("================ 9")

// not a very good test of currentOp, but tests that it at least 
// is sort of there:
assert( db.currentOp().inprog != null );
print("================ 10")

assert(false)
print("================ 11")
