Ext.define('Rob.view.Menu', {
	extend: 'Ext.menu.Menu',
	alias: 'widget.rmenu',
	id: 'tbMenu',

	items: [{
		text: 'Add Object',
		icon: 'images/add.png',
		action: 'addn',
	}, {
		text: 'Manage Object',
		icon: 'images/edit.png',
		action: 'edn',
	}, {
		text: 'Remove Object',
		icon: 'images/delete.png',
		action: 'rm',
	}, {
		xtype: 'menuseparator'
	/*
	}, {
		text: 'add edge',
		icon: 'images/add.png',
		action: 'addn',
	}, {
		text: 'manage edge',
		icon: 'images/edit.png',
		action: 'ede',
	}, {
		xtype: 'menuseparator',
		*/
	}, {
		text: 'export graph',
		action: 'ex',
	}, {
		text: 'import graph',
		action: 'im',
	}],
});
