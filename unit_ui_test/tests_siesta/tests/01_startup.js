StartTest(function(t) {
    t.diag("Sanity");

    t.ok(Ext, 'ExtJS is here');
    t.ok(Ext.Window, '.. indeed');

	t.requireOk('Rob.view.Viewport');
	t.requireOk('Rob.model.Object');
	t.requireOk('Rob.model.Attribute');

   //t.ok(Rob.app.js, 'My project is here');
   // t.ok(Rob.a, '.. indeed');

   // t.done();   // Optional, marks the correct exit point from the test
})