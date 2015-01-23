doStartApp = function() { 
    Application = Ext.create('Ext.app.Application', {

        name: 'Rob',
        models: ['Attribute', 'Object', 'Relation', 'RobList'],
        controllers: ['Navigation', 'Object', 'Record', 'ImportExport', 'Graph', 'Menu', 'AppEvents'],
		stores: ['Attribute', 'Object', 'Relation', 'RobList'],
		views:['Viewport'],
        launch: function() {
			Rob.ORM = Application;
			Ext.History.init();
			Ext.QuickTips.init();
			Ext.require("Rob.window.ObjectForm");
			Ext.require("Rob.view.Object");
			Ext.require("Rob.ReferenceManager");

			// Define objects AFTER EACH dependency is loaded
			
			//include the tests in the test.html head
			jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
			jasmine.getEnv().execute();
        }
    });
}

Ext.Loader.setConfig({
    enabled : true,
    paths   : {
        "Rob" : "./app/",
        "Ext.ux" : './extjs/ux/',
    } 
});

Rob = {};

Ext.Loader.loadScript('app/Utils.js');
Ext.require('Rob.util.CustomIdGenerator');
Ext.require('Ext.app.Application');
Ext.require('Rob.store.Object');
//Ext.require('Rob.view.Viewport');

function clearDatabase() {
	var store;
	var clearStore = function(store) {
		while (store.count())
			store.removeAt(0);
		store.sync();
	};

	Ext.getStore("Object").each(function(item) {
		store = Ext.getStore(item.get("sName"));
		console.log(store.storeId);
		clearStore(store);
	});
	clearStore( Ext.getStore("Object") );
	clearStore( Ext.getStore("Relation") );
	clearStore( Ext.getStore("Attribute") );
	clearStore( Ext.getStore("RobList") );
}

var Application = null;
Ext.onReady(function() {
	Ext.Ajax.request({
		url: './bcknd/authenticate.php',
        method: 'POST',
      	params: {
			response: hex_md5(ch+pw),
			username: un,
		},
		success: function(response, opts) {
			doStartApp();
		},
		failure: function(response, opts) {
			Ext.MessageBox.show({
			  title: 'Error loggin in',
			  msg: action.result.message,
			  buttons: Ext.Msg.OK,
			  icon: Ext.MessageBox.ERROR
			});
		}
	});
});

