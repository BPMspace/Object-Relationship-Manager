Ext.define('Rob.window.Export', {
	extend: 'Ext.window.Window',
	title: 'Export Data',
	autoScroll: true,
	width: 400,
	heigth: 200,

	items: [{
		xtype: 'form',
		margin: 10,
		width: '380',
		items: [{
			xtype: 'checkbox',
			labelWidth: 130,
			name: 'exportData',
			fieldLabel: 'Include Data',
			flex: 1,
		}],
	}],
	buttons: [{
		text: 'Export',
		action: 'export',
		id: 'exportButton',
	}],
});
