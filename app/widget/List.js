Ext.define('Rob.widget.List', {
	extend: 'Ext.form.FieldContainer',
	alias: 'widget.wlist',
	frame: false,
	mixins:{
		field: 'Ext.form.field.Base',
	},
	content: [],
	changed: false,

	initComponent: function() {
		this.callParent();
		this.reset();
	},

	reset: function() {
		this.removeAll();
		this.content = [];
		this.changed = false;
		this.add(this.inputField);
	},

	setValue: function(val) {

		this.reset();

		if (!val) return;

		this.content = val.split("$");
		if (val != "")
			this.setItems();
	},

	setItems: function() {
		var items = [];
		for (i in this.content) {
			items.push(this.appendItem(i,true));
		} 
		this.insert(this.items.length - 1, items);
	},

	appendItem: function(i, noadd) {
		var item = { 
			xtype: 'form',
			width: 400,
			value: this.content[i],
			layout: "column",
			defaults: {
				frame: false,
			},
			items: [
				{
					columnWidth:0.8,
					xtype: 'displayfield', 
					keyid: i, 
					value: this.content[i],
				}, 
				{xtype: 'button', keyid: i, text:'Remove', handler: 
				function() {
					this.up("wlist").content[this.keyid] = null;
					this.up("wlist").changed = true;
					this.up().removeAll();
				} ,
				columnWidth:0.2,
			} ]
		};
		if (noadd)
			return item;
		this.insert(this.items.length - 1, item);
	},
	getValue: function() {
		var ret = [];
		Ext.each(this.content, function(item) {
			if (item != null)
				ret.push(item);
		});
		return ret.join("$");
	},

	items: [ 
	],

	inputField: {
		xtype: 'textfield',
		emptyText: 'Insert a list Item',
		width: 400,
		submitEmptyText: false, // TODO nach basic form
		itemId: "lala",
		name: 'lala',
		regex: /^(?!.*\$)/,
		listeners: {
			specialkey: function(field, e){
				if ((e.getKey() == e.ENTER) && this.isValid()) {
					var i = this.up().content.push(field.value);
					this.up().changed = true;
					this.up().appendItem(i-1);
					field.setValue("");
				}
			}
		},
	},
});
