StartTest(function(t) {

    t.requireOk('Rob.model.Attribute', function() {
        var mod = Ext.create('Rob.model.Attribute', {
         id: 'a1234',  // The ID of that atttrib
		 type: 'checkbox', // The type of the widget, that will be added to the view
		 name: 'nett', // Text attached to that widget
		kind:'person', // Which view/store/model name
		params:'', // Extra params
		fieldDefaults:''
        
        });
        
        t.is(mod.get('id'), 'a1234', 'finds ID');
        t.is(mod.get('name'), 'nett', 'finds Name');
        t.is(mod.get('type'), 'checkbox', 'finds Type');
        t.is(mod.get('kind'), 'person', 'find Parent Object');
      //  t.is(mod.get('relations'), 'r1234', 'finds Relations');
      //  t.is(mod.get('displayname'), 'abcd', 'finds Displayname');

       //t.is(mod.get('email'), 'some@email.net', 'Could read email');
    });
});