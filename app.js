/**
 * Main Application of ORM
 *
 */

var bcknd = "";
var sprefix = "com.mitsm.configurator.";

// Tell ext where to find my code and other ux code
//
Ext.Loader.setConfig({
    enabled : true,
    paths   : {
        "Rob" : './app/',
        "Ext.ux" : './extjs/ux/',
    } 
});

Ext.Loader.loadScript(bcknd + 'app/Utils.js');

// Init the namespace
Rob = {};

// The loader wanted me to include them
Ext.require('Rob.util.CustomIdGenerator');
Ext.require('Ext.form.Panel');
Ext.require('Ext.form.field.Date');
Ext.require('Rob.store.RobList');
Ext.require('Rob.store.Relation');
Ext.require('Rob.store.Attribute');
Ext.require('Rob.store.Object');

Ext.application({
    name: 'Rob',

    autoCreateViewport: true,

    models: ['Attribute', 'Object', 'Relation', 'RobList'],
    stores: ['Attribute', 'Object', 'Relation', 'RobList'],
    controllers: ['Navigation', 'Object', 'Record', 'ImportExport', 'Graph', 'Menu', 'AppEvents'],
	appProperty: 'ORM',

	launch: function() {

		Ext.History.init();
		Ext.QuickTips.init();
		Ext.require("Rob.window.ObjectForm");
		Ext.require("Rob.view.Object");
		Ext.require("Rob.ReferenceManager");
		Rob[this.appProperty] = this;

		var app = this;

		// Define objects AFTER EACH dependency is loaded
		Ext.getStore("Attribute").load(function() {
			Ext.getStore("Relation").load(function() {
				Ext.getStore("Object").load(function() {
					Ext.getStore("Object").each(function(item) { 
						item.define(); 
					});
				}); 

				// This Changes the Application State
				// grep for consumers in the source
				new Ext.util.DelayedTask(function(){
					app.fireEvent("DoneLoadingObject");
				}).delay(100);

			});
		});
	},
});
