Ext.define('Rob.model.Relation', {
	extend: 'Ext.data.Model',
	idgen: 'rob',
	fields: [ 
		'id',  // The ID of that relation
		'from', // id of the originating object (NOT INSTANCE)
		'kind', // name of the originating object (NOT INSTANCE)
		'to', // id of the target object (AGAIN NOT INSTANCE)
		'name_ab', // the name, e.g. mitarbeiter
		'name_ba', // the name, e.g. arbeitsplatz
		'cardinality', // e.g. 1:n 
	],
});
