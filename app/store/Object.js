Ext.define('Rob.store.Object', {
    model: 'Rob.model.Object',
    extend: 'Ext.data.Store',
    requires: 'Rob.model.Object',
	autoLoad: false,
	autoSync: true,
	table: "objects",

    proxy: {
		type: 'ajax',
		url: bcknd + 'bcknd/',
		extraParams: {table: "objects"},
		reader: {
			type: 'json',
		}, 
		api: {
			create  : 'bcknd/fn.php?fn=new',
			read    : 'bcknd/fn.php?fn=load',
			update  : 'bcknd/fn.php?fn=update',
			destroy : 'bcknd/fn.php?fn=destroy'
		},
	},
	listeners: {
		add: {
			fn: function(store, objArr, ops) {
				objArr[0].define();
			}
		},
		update: {
			fn: function(store, obj, ops) {
				if (ops == Ext.data.Model.EDIT) {
					obj.define();
				}
			},
		},
		remove: {
			fn: function(store, record) { Rob.ORM.fireEvent("ObjectClassRemoved", record.get("id"), record.get("sName")); }
		},
	},
});
