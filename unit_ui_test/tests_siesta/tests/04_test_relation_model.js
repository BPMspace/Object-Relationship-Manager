StartTest(function(t) {

    t.requireOk('Rob.model.Relation', function() {
        var mod = Ext.create('Rob.model.Relation', {
        	id: 'r1234',  // The ID of that relation
		    from: 'person', // id of the originating object (NOT INSTANCE)
			kind: 'person', // name of the originating object (NOT INSTANCE)
		    to: 'person', // id of the target object (AGAIN NOT INSTANCE)
		    name_ab: 'has', // the name, e.g. mitarbeiter
		    name_ba: 'is being held by', // the name, e.g. arbeitsplatz
		    cardinality: '1n', // e.g. 1:n
        
        });
        
        t.is(mod.get('id'), 'r1234', 'finds ID');
        t.is(mod.get('name_ab'), 'has', 'finds name_ab');
        t.is(mod.get('name_ba'), 'is being held by', 'finds name_to');
        t.is(mod.get('from'), 'person', 'finds source object');
        t.is(mod.get('to'), 'person', 'finds target object');
 });
});