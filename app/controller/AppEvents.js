// This contols both the
// StarfieldSimulation and the ObjectInfo
// unfortunately it is more clumsy to handle 
// object instances in here, hence look at 
// the defineStore in model/Object.js
// views.
Ext.define('Rob.controller.AppEvents', {
	extend: 'Ext.app.Controller',

	stores: ['Object', 'Relation'],

	init: function() {
		console.log("Init Listeners");
		this.getObjectStore().on({
			'remove': 	{ fn: this.objectStoreRemoved, scope: this },
		});
	},


	edgeChanged: function(store, record, edge) {
		console.log(record + " and " + edge);
		this.application.fireEvent("EdgeInstanceChanged", record.get("id"), edge.get("id"), store.storeId);
	},

	// This means am edge has been created / deleted
	// TODO
	relationStoreWritten: function(store, operation, ops) {
		this.getGraph().loadGraph();
	},
});

