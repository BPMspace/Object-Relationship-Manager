Ext.define('Rob.view.AttributeForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.aform',
	autoHeight:true,
	autoScroll: true,
	frame: false,
	
	items: [{
		xtype: 'textfield',
		fieldLabel: "Attribute Name",
		name: 'name',
		allowBlank: false,
	}, {
		xtype: 'radiogroup',
		fieldLabel: 'Attribute Type',
		// Arrange radio buttons into two columns, distributed vertically
		columns: 2,
		allowBlank: false,
		vertical: true,
		items: [
			{ boxLabel: 'Date/Time Attribute', name: 'type', inputValue: 'xdatetime' },
			{ boxLabel: 'Date Attribute', name: 'type', inputValue: 'wdate' },
			//{ boxLabel: 'Time Attribute', name: 'type', inputValue: 'wtime' },
			{ boxLabel: 'TRUE/FALSE Attribute', name: 'type', inputValue: 'checkbox' },
			{ boxLabel: 'List Attribute', name: 'type', inputValue: 'wlist' },
			{ boxLabel: 'Drop Down List', name: 'type', inputValue: 'wrlist' },
			{ boxLabel: 'Freitext Attribute', name: 'type', inputValue: 'textfield', checked: true, },
			{ boxLabel: 'Richtext Attribute', name: 'type', inputValue: 'htmleditor' },
			{ boxLabel: 'Number Field', name: 'type', inputValue: 'numberfield' },
		],
	}, {
		title: "Edit defaults",
		name: 'fieldDefaultsContainer',
		margin: 5,
		collapsible: true,
		collaped: true,
		items: [{
			xtype: "textfield", 
			fieldLabel: "Default Value",
			name: 'fieldDefaults',
		}],
	}, {
		xtype: 'displayfield',
		name: 'kind',
		hidden: true,
	}],
	dockedItems: [{
		xtype:'toolbar',
		dock:'bottom',
		ui:'footer',
		itemId: 'attributeToolbar',
		
		items: ['->', {
		xtype:'component', flex:1
		}]
		}]
});
