StartTest(function(t) {

    t.requireOk('Rob.model.RobList', function() {
        var mod = Ext.create('Rob.model.RobList', {
        	id: 'roblist1234',  // The ID of that relation
		    name: 'roblist1', // id of the originating object (NOT INSTANCE)
			values: '1$2$3', // name of the originating object (NOT INSTANCE)
		   
        });
        
        t.is(mod.get('id'), 'roblist1234', 'finds ID');
        t.is(mod.get('name'), 'roblist1', 'finds Name');
        t.is(mod.get('values'), '1$2$3', 'finds its values');
        });
});