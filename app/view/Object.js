Ext.define('Rob.view.Object', {
	extend: 'Ext.form.Panel',
	alias: 'widget.object',
	addedFields: [],
	autoScroll: true,
	objectKind: "INVALID",
	trackResetOnLoad: true,

	bodyPadding: 10,
	defaults: {
		border: false,
	},

	defaultType: 'textfield',

	items: [
	    {
	        xtype: 'displayfield',
	        fieldLabel: 'ID',
			labelWidth: 100,
	        name: 'id',
	    }, {
	        fieldLabel: 'Name',
			labelWidth: 100,
	        name: 'name',
	        allowBlank: false,
	        regex: new RegExp('^[A-Za-z0-9_\\-\[\*\+\(\)\\]\{\}\.\/\:\ ]+$')


	    }, {
			xtype: 'tabpanel',
			defaults: {
				border: false,
			},

			items: [{
				xtype: 'panel',
				title: 'Attributes',
			},{
				xtype: 'panel',
				title: 'Relations',
			}]
		}
	],

	initComponent: function() {
		this.addedFields = [];
		this.callParent();
		this.addObjectFields();
	},

	getCurrentObjectId: function() {
		return this.getForm().getRecord().get("id");
	},

	loadRecord: function(record) {
		this.callParent(arguments);
		this.load();		
	},

	isDirty: function(cmp) {
		var dirty = false;

		if (!cmp) cmp = this;

		if (cmp.rendered == false) return false;

		cmp.items.each(function(item) {
			if (typeof(item.isDirty) === 'function') {
				dirty |= item.isDirty();
			} else
				if (item.items)
					dirty |= this.isDirty(item);

		}, this);
		return dirty;
	},

	store: function() {
		var button = this.down("[action=objectStoreRecord]");
		button.fireEvent("click", button);
	},

	addField: function (item) {
		if (item == "")
			return;

		var store_id = item.split(".");
		var store = store_id[0];
		var id = store_id[1];

		if (store == "InRelation")
			store = "Relation";

		// Ueberfluessig
		//if ((this.addedFields.indexOf(id) > -1) && (store != "InRelation")) {
		if (this.addedFields.indexOf(item) > -1) {
			console.log("Already added " + item);
			return;
		}
		console.log(store);
		var record = Ext.getStore(store).findRecord("id", id,0,false,false,true);
		if (!record) {
			console.log("Did not find " + id + " " + item + " in store " + store);
			return;
		}

		// I am overwriting InRelations StoreName, therefore use the split value
		if (store_id[0] == "Attribute")
			this.addAttributeField(record);
		else if (store_id[0] == "Relation")
			this.addRelationField(record);
		else if (store_id[0] == "InRelation")
			this.addIncommingRelationField(record);
		else 
			console.log("Unknown type " + item);
	},

	addRelationField: function (relation) {
		console.log("Adding a " + relation.data.kind + " called " + relation.data.name_ab + " to " + this.objectKind); 
		if (relation.data.kind != this.objectKind) {
			console.log("Relation is of wrong kind " + relation.data.kind);
			//return;
		}

		// Every Relation points to a store. 
		// Do it here insted of overwriting intComponent
		var s;
		var record = Ext.getStore("Object").findRecord("id", relation.data.to,0,false,false,true);
		if (record) {
			var storeName = Ext.getStore(record.get("sName"));
			console.log("Binding to =" + storeName + "=");
			s = Ext.getStore(storeName);
		} else {
			console.log("Error loading Store. Relation " + relation.data.id + " broken");
			s= [ "Error loading Store. Relation " + relation.data.id + " broken" ];
		}
		var o = {
			xtype: relation.data.cardinality,
			//title: relation.data.name_ab + " to "+ "Object: " +  record.data.name,
			fieldLabel: relation.data.name_ab,
			from: relation.data.from,
			to: relation.data.to,
			name: relation.data.id,
			objectRecordId: record.data.id,
			cardinality: relation.data.cardinality,
			relationid: relation.data.id,
			relation: "Outgoing",
			to: relation.data.to,
			labelWidth: 100,
			store: s,
		};
		this.items.last().items.last().add(o);
		//this.down('[xtype='+relation.data.cardinality+']').collapse();

		this.addedFields.push("Relation." + relation.data.id);

	},

	addIncommingRelationField: function (relation) {
		console.log("Adding an incomming Relation called " + relation.data.name_ba);

		// Every Relation points to a store. 
		// Do it here insted of overwriting intComponent
		var store;
		var name = relation.data.id;
		var type = "from" + relation.data.cardinality.substr(0, 1); 
		var record = Ext.getStore("Object").findExactRecord("id", relation.data.from);

		if (record)
			store = Ext.getStore(record.get("sName"));
		else
			store = [ "Error loading Store. Relation " + relation.data.id + " broken" ];

		var o = {
			xtype: type,
			//title:  relation.data.name_ba + " to "+ "Object: " +  record.data.name,
			cardinality: relation.data.cardinality,
			fieldLabel: relation.data.name_ba,
			from: relation.data.to,
			to: relation.data.from,
			objectRecordId: record.data.id,
			relationid: name,
			labelWidth: 100,
			relation: "Incomming",
			store: store,
		};
		this.items.last().items.last().add(o);
		//this.down('[xtype='+type+']').collapse();

		this.addedFields.push("InRelation." + relation.data.id);
	},

	addAttributeField: function (attribute) {
		console.log("Adding to " + attribute.data.kind + " a " + attribute.data.type + " called " + attribute.data.name);
		if (attribute.data.kind != this.objectKind) {
			console.log("Attribute is of wrong kind " + attribute.data.kind);
			//return;
		}

		var o = {
			xtype: attribute.get("type"),
			fieldLabel: attribute.get("name"),
			title: attribute.get("name"),
			name: attribute.get("id"),
			params: attribute.get("params"),
			labelWidth: 100,
		};

		var preset = attribute.get("fieldDefaults");
		if (preset && preset != "") {
			o.value = preset;
		}

		if (o.xtype == "htmleditor") {
			o.plugins = [
				Ext.create('Ext.ux.form.plugin.HtmlEditor',{
					enableAll:  true
				})
			];
		}

		this.items.last().items.first().add(o);
		this.addedFields.push("Attribute." + attribute.data.id);
	},

	// Merges Attributes and Relations into a Form
	addObjectFields: function() {
		console.log("Merge all attributes/relations for " + this.objectKind);
		var me = this;
		if (this.addedFields.length) {
			console.log("Was??", this.addedFields);
			return;
		}

		// If a == -1 the impossible happened and we do not want to proceed anyway
		var objectType = Ext.getStore("Object").getAt(
			Ext.getStore("Object").findExact("sName", this.objectKind)
		);

		//if (!objectType)
		//	return;

		var fields = (objectType.get("attributes") + " " + objectType.get("relations")).split(" ");
		console.log("Found these attributes/relations " + fields);

		Ext.each(fields, function(item) {
			this.addField(item);
		}, this);
	},
	removeField: function (item) {
		if (item == "")
			return;

		var store_id = item.split(".");
		var store = store_id[0];
		var id = store_id[1];

		// Added fields is never updated. This is solved by a reload
		// and not harmful
		if (this.addedFields.indexOf(item) < 0) {
			console.log("Nothing to do, Never added " + item);
			console.log(this.addedFields);
			return;
		}
		var cmp = this.down("[name="+id+"]") || this.down("[relationid="+id+"]");
		cmp.up().remove(cmp);
	},

	load: function() {
		var from1=this.query("from1");
		from1.forEach(function(item, idx) {
			item.load();
		});
		var toN=this.query("fromn");
		toN.forEach(function(item, idx) {
			item.load();
		});
		var nto1=this.query("n1");
		nto1.forEach(function(item, idx) {
			item.load();
		});
		var to1=this.query("11");
		to1.forEach(function(item, idx) {
			item.load();
		});
	},

	commit: function() {
		var from1=this.query("from1");
		from1.forEach(function(item, idx) {
			item.commit();
		});
		var toN=this.query("fromn");
		toN.forEach(function(item, idx) {
		console.log("Asked to commit fromn");
			item.commit();
		});
		var nto1=this.query("n1");
		nto1.forEach(function(item, idx) {
			item.commit();
		});
		var to1=this.query("11");
		to1.forEach(function(item, idx) {
			item.commit();
		});
	},
	
	buttons: [
	    {
	        text: 'Delete',
			//id: 'objectDeleteRecord',
			action: 'objectDeleteRecord',
	    }, {
	        text: 'Save',
	        formBind: true,
			//id: 'objectStoreRecord',
			action: 'objectStoreRecord',
	    }, {
	        text: 'Add Attribute',
			action: 'objectAddAttribute',
			//id: 'objectAddAttribute',
	    }, {
	        text: 'Add Relation',
			action: 'objectAddRelation',
	    }
	]
});
