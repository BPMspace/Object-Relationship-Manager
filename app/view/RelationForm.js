Ext.define('Rob.view.RelationForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.rform',
	height: 200,
	frame: false,
	//layout:"column",
	frame: false,
	objectName:undefined,
	defaults:{
		hideLabels:true,
		border:false,
		bodyStyle:'padding:4px',
		
	},
	items:[{
		xtype:'container',
		layout:'column',
		border:true,
		columns:3,
		vertical:true,
		border:false,
		items:[{
		columnWidth:0.3,
		xtype: 'fieldset',
		collapsible: false,
		border:false,
		title: 'Object Name',
		collapsed:false,
		
		items:[{
		
		xtype: 'displayfield',
		name: 'displayObject',
		}]},
		{
		columnWidth:0.3,
		xtype: 'fieldset',
		title: 'Source Name',
		border:false,

		collapsed:false,
		collapsible: false,
		items:[{
		xtype : "textfield",
		name : "name_ab",
		allowBlank: false,
		}]	
		},
		{
		xtype: 'fieldset',
		collapsible: false,
		border:false,
		title:'Cardinality',
		collapsed:false,
		items:[{
		
		xtype: 'displayfield',
		name: 'displaySentence',
		value:'Exactly one'

		}]},
		{
		columnWidth:0.3,
		xtype: 'fieldset',
		title: 'Target Object',
		collapsed:false,
		collapsible: false,
		border:false,

		items:[{
		xtype : "combo",
		name: "to",
		store: Ext.getStore("Object"),
		editable:false,
		displayField: "name",
		allowBlank: false,
		valueField: "id",
		listeners:{
			select: function(item, records) {
				var value= records[0].get("name");
				this.fireEvent("targetObjectSelected",this.up("window"),value);
			}
		}
		}]}]
		},
		//second row
		{
		xtype:'container',
		layout:'column',
		columns:3,
		vertical:true,
		items:[
		{
		columnWidth:0.3,
		xtype: 'fieldset',
		layout:'column',
		collapsible: false,
		border:false,
		title: 'Target Object',
		collapsed:false,
		items:[{
		
		xtype: 'displayfield',
		name: 'displayTargetObject',
		value: '--'
		}]},
		{
		columnWidth:0.3,
		xtype: 'fieldset',
		border:false,
		title: 'Target Name',
		collapsed:false,
		collapsible: false,
		items:[{
		xtype : "textfield",
		name : "name_ba",
		allowBlank: false,
		}]	
		},
		{
		xtype: 'fieldset',
		collapsible: false,
		border:false,
		title:'Cardinality',
		collapsed:false,
		items:[{
		
		xtype: 'displayfield',
		name: 'displaySentence',
		value:'Exactly one'
		}]},
		{
		columnWidth:0.3,
		xtype: 'fieldset',
		title: 'Object Name',
		collapsed:false,
		collapsible: false,
		border:false,

		items:[{
		xtype: 'displayfield',
		name: 'displayObject2',
		}]}]},
		{
		columnWidth:1.0,
		xtype: 'fieldset',
		title: 'Relation Type',
		collapsed:false,
		collapsible: false,
		border:false,
		autoHeight : true,
		items:[{
		xtype: 'radiogroup',
		columns: 4,
		allowBlank: false,
		vertical: true,
		items: [
			{ boxLabel: '1:1', name: 'cardinality', inputValue: '11', checked: true },
			{ boxLabel: '1:n', name: 'cardinality', inputValue: '1n' },
			{ boxLabel: 'n:1', name: 'cardinality', inputValue: 'n1' },
			{ boxLabel: 'n:n', name: 'cardinality', inputValue: 'nn' }
		]
		}]},
		{
		xtype: 'displayfield',
		name: 'kind',
		hidden: true,
		}],
	buttons: [{
		text: 'Save',
		id: "relationSave",
		action: "relationSave",
		formBind: true,
		handler: function() { this.up("window").close(); }
	}]
});
