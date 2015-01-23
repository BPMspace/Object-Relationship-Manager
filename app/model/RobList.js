Ext.define('Rob.model.RobList', {
	extend: 'Ext.data.Model',
	idgen: 'uuid',
	fields: [ 
		'id', 'name', 'values',
	],
	proxy: {
		type: 'ajax',
		url: bcknd + 'bcknd/',
		extraParams: {table: "roblists"},
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
});
