Ext.define('Rob.store.Relation', {
    model: 'Rob.model.Relation',
    extend: 'Ext.data.Store',
    requires: 'Rob.model.Relation',
	autoLoad: true, // Do this manually in app.js and define success handler to setup objects
	autoSync: true,

    proxy: {
		type: 'ajax',
		url: bcknd + 'bcknd/fn.php?func=relation',
		reader: {
			type: 'json',
		},
		api: {
			create  : 'bcknd/fn.php?table=relations&fn=new',
			read    : 'bcknd/fn.php?table=relations&fn=load',
			update  : 'bcknd/fn.php?table=relations&fn=update',
			destroy : 'bcknd/fn.php?table=relations&fn=destroy'
		},
	},

});
