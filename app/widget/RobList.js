Ext.define('Rob.widget.RobList', {
	extend: 'Ext.form.FieldContainer',
	alias: 'widget.wrlist',
	frame: false,
    mixins:{    
		field: 'Ext.form.field.Base',
    },

    initComponent: function() {
		this.callParent();
    	// Set the store here
    	var record = Ext.getStore("RobList").findExact("id", this.params);
    	if (record > -1) {
    		this.store = Ext.getStore("RobList").getAt(record).data.values.split("$");
    		this.items.first().bindStore(this.store);
       	} else {
    		console.log("Could not find id " + this.params);
    	}


    },

    setValue: function(val) {
    	return this.items.first().setValue(val);
    },
    getValue: function() {
    	return this.items.first().getValue();
    },

    	
    items:[{
        xtype: 'combo',
        store: ["Loading"],
        //rest of combo config,
    }]
		
});
