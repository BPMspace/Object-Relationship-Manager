Ext.define('Rob.model.Attribute', {
	idgen: 'rob',
	extend: 'Ext.data.Model',
	fields: [ 
		'id',  // The ID of that atttrib
		'type', // The type of the widget, that will be added to the view
		'name', // Text attached to that widget
		'kind', // Which view/store/model name
		'params', // Extra params
		'fieldDefaults',
	],
});
