Ext.define('Rob.window.Import', {
	extend: 'Ext.window.Window',
	title: 'Import Data',
	autoScroll: true,
	width: 400,
	heigth: 200,

	padding: 10,
	items: [{
		xtype: 'form',
		defaults: {
			labelWidth: 130,
		},
		margin: 10,
		items: [{
			xtype: 'filefield',
			allowBlank: false,
			name: 'fileupload',
			width: 350,
			fieldLabel: "Import Object Data",
			buttonText: "Select File",
		}, {
			xtype: 'checkbox',
			fieldLabel: 'Include Data',
			name: 'importData',
			flex: 1,
		}, {
			xtype: 'checkbox',
			fieldLabel: 'Overwrite Existing Data',
			name: 'importOverwrite',
			flex: 1,
		}],
	}],
	buttons: [{
		text: 'Import',
		action: 'export',
		id: 'importButton',
	}],
});
