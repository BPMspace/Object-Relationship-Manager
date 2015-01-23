StartTest(function(t) {

    t.requireOk('Rob.model.Object', function() {
        var mod = Ext.create('Rob.model.Object', {
         //id: 1234, 
		 name: 'dir1', 
		 sName: 'dir1', // Name of the Table, Store, View, etc.
		 //attributes:'a1234',
		 //relations: 'r1234',
		 //displayname: 'abcd',
        });
        
       // t.is(mod.get('id'), 1234, 'finds ID');
        t.is(mod.get('name'), 'dir1', 'finds Name');
        t.is(mod.get('sName'), 'dir1', 'finds sName');
        //t.is(mod.get('attributes'), 'a1234', 'finds Attributes');
        //t.is(mod.get('relations'), 'r1234', 'finds Relations');
       // t.is(mod.get('displayname'), 'abcd', 'finds Displayname');

       //t.is(mod.get('email'), 'some@email.net', 'Could read email');
    });
});