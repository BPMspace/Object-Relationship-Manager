Ext.define('Rob.store.Attribute', {
    model: 'Rob.model.Attribute',
    extend: 'Ext.data.Store',
    requires: 'Rob.model.Attribute',
	autoLoad: true,
	autoSync: true,

    proxy: {
		type: 'ajax',
		url: bcknd + 'bcknd/fn.php?func=attribute',
		reader: {
			type: 'json',
		},
		api: {
			create  : 'bcknd/fn.php?table=attributes&fn=new',
			read    : 'bcknd/fn.php?table=attributes&fn=load',
			update  : 'bcknd/fn.php?table=attributes&fn=update',
			destroy : 'bcknd/fn.php?table=attributes&fn=destroy'
		},
	},

});
