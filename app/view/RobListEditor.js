Ext.define('Rob.view.RobListEditor', {
	//extend: 'Ext.form.Panel',
	extend: 'Ext.form.FieldContainer',
	width: 600,
	alias: 'widget.redit',
	frame: false,
    mixins:{    
		field: 'Ext.form.field.Base',
    },

	title: "Configure Attribute",
	layout: "column",
	currentrecord: undefined,
	defaults:{
		hideLabels:true,
		border:false,
		bodyStyle:'padding:4px',
	},
	items: [{
		columnWidth:0.3,
		xtype: 'fieldset',
		collapsible: true,
		title: 'Copy an existing List',
		collapsed: true,
		items: [{
			xtype: "combo",
			displayField: "name",
			valueField: "id",
			store: Ext.getStore("RobList"),
			listeners: {
				select: function(item, records) {
					var list = this.up("redit").down("wlist");
					if (list.changed) { 
						console.log("Why did the list change?");
						var val = list.getValue();
						var record = Ext.getStore("RobList").findExact("id", this.currentrecord.data.id);
						console.log(currentrecord);
						if (val == "") {
							Ext.getStore("RobList").removeAt(record);
						} else {
							Ext.getStore("RobList").getAt(record).data.values = val;
						}
					} 
					// load into other window
					this.currentrecord = records[0].get("values");
					list.setValue(this.currentrecord);
				},
			},
			}],
	}, {
		xtype: 'fieldset',
		columnWidth:0.7,
		collapsible: true,
		title: 'Edit List Items',
		items: [{
			xtype: 'wlist',
			store: Ext.getStore("RobList"),

			listeners:{
			render: function(){
				
				var store = Ext.getStore("RobList");
				if(this.up("form").getForm().getRecord())
				{
				var record = store.findExactRecord("id", this.up("form").getForm().getRecord().data.params);
				}
				else return;
				if (!record) {
					console.log("No record");
					return;
			
			}
			else {
			console.log("Record is here");

			this.setValue(record.get("values"));
			}

			}
			}
		}],
	}],

    setValue: function(val) {
    	// This normally never happens
    },

    getValue: function() {
    	// Now check if items[1] has changed and update the store
    	var store = Ext.getStore("RobList");
    	var name = this.down('combo').getValue();
    	if (!name) {
    		if(this.up("form").getForm().getRecord())
    		{
    		var name= this.up("form").getForm().getRecord().data.params;
			//var name = this.attribName;
    		}
    		
    	}
		var record = store.findExactRecord("id", name);
		var values = this.down('wlist').getValue();

		if (!record) {
			// I Need to create a new Record
			console.log("Create New item");
			record = Ext.create("Rob.model.RobList");
			record.data.name = name;
			record = store.add(record).pop();
		} 
		record.set("values", values);
		return record.get("id");
    },
});
