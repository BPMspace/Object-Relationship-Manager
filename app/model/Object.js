Ext.define('Rob.model.Object', {
	extend: 'Ext.data.Model',
	fields: [ 
		'id', 
		'name', 
		'sName', // Name of the Table, Store, View, etc.
		'attributes',
		'relations',
		'displayname',
	],
	nTOn: false,
	idgen: 'rob',

	define: function() {
		var name = this.get("sName");
		var modelName = "Rob.model." + name;
		var storeName = "Rob.store." + name;
		var viewName = "Rob.view." + name;

		if (name == "") {
			console.log("Hit an error condition, name is empty, check the Object store")
			return;
		}

		var skeletonFields = ['name', 'description', 'version', 'id'];

		var items = this.get("attributes") + " " + this.get("relations");
		Ext.each(items.split(" "), function(item) {
			if (item == "")
				return;
			item = item.split(".")[1];
			skeletonFields.push(item);
		});

		console.log("Defining new " + modelName + " Model with " + skeletonFields.join(" "));
		if (Ext.ClassManager.isCreated(modelName)) { 
			this.defineModel(skeletonFields, modelName, storeName, name);
			this.defineStore(modelName, storeName, name, false);
		} else { 
			this.defineModel(skeletonFields, modelName, storeName, name);
			this.defineStore(modelName, storeName, name, true);
			this.defineView(viewName, modelName, name);
		}
	}, 
	defineModel: function(skeletonFields, modelName, _storeName, name) {
		Ext.define(modelName, {
			extend: 'Ext.data.Model',
			fields: skeletonFields,
			storeName: _storeName,
			idgen: 'rob',
			autoload: true,
			proxy: {
				type: 'ajax',
				url: bcknd + 'bcknd/',
				// Turns off Paging
				pageParam: undefined,
				startParam: undefined,
				limitParam: undefined,
				extraParams: { table: name },
				reader: {
					type: 'json',
				}, 
				api: {
					create  : 'bcknd/fn.php?fn=new',
					read    : 'bcknd/fn.php?fn=load',
					update  : 'bcknd/fn.php?fn=update',
					destroy : 'bcknd/fn.php?fn=destroy'
				},
			},
			getRelations: function() {
				var objectClass = Ext.getStore("Object").findExactRecord("sName", this.proxy.extraParams.table);
				var edges = objectClass.get("relations");
				edges = edges.replace(/Relation./g, '');
				return edges.split(" ");
			},
		});
	}, 

	storeChange: function(store, records, action, opt) {
		var ev = undefined;
		if (!Ext.isArray(records)) records = [records];
		switch (arguments.length) {
			case 5:
				// This call orginated from an update 
				// which was fired directly after add
				if (action != Ext.data.Model.EDIT) return;
				action = arguments[4].action;
				opt = arguments[3];
				break;
			case 4: 
				action = arguments[3].action;
				opt = undefined;
				break;
			default: throw("Unknown number of Arguments");
		}
		switch (action) {
			case "remove": 	ev = "ObjectInstanceRemoved"; break;
			case "update": 	ev = "ObjectInstanceChanged"; break;
			case "add": 	ev = "ObjectInstanceCreated"; break;
		}
		for (var i in records) {
			Rob.ORM.fireEvent(ev, records[i], store.storeId, opt);
		}
	},

	/**
	 * Defines a store.
	 * Has magic to reload the tree and to instantiate itselve
	 */
	defineStore: function(modelName, storeName, name, sendEvent) {

		Ext.define(storeName, {
			extend: 'Ext.data.Store',
			model: modelName,
			requires: modelName,
			storeId: name,
			autoLoad: true,
			// opt for optional data
			listeners: {
				add: {
					buffer: 10,
					fn: this.storeChange,
					action: "add"
				},
				update: {
					buffer: 10,
					fn: this.storeChange,
					action: "update"
				},
				remove: {
					buffer: 10,
					fn: this.storeChange,
					action: "remove"
				},
			},
		}, function() {
			var store = Ext.create(storeName);
			var storeId = Ext.getStore("Object").findExactRecord("sName", name);
			try {
			if (!sendEvent) 
				return;
				var id = storeId.get("id");
				store.on({load: { fn: function() { Rob.ORM.fireEvent("ObjectClassCreated", id, name) }, single: true }});
			} catch (e) {
				console.log(e);
			}	
		});
	}, 

	/**
	 * Define a View. 
	 * Initial adding of attributes happens in the view's constructor.
	 * This is lazy initialized in the Navigation controller.
	 * Why? Glad you asked: Models have circular dependencies 
	 * e.g. group might not be defined, but people want to reference it.
	 * This causes a problem ONLY for the view. Hence the first click meas
	 * Ready-Steady-Go
	 */
	defineView: function(viewName, modelName, name) {
		Ext.define(viewName, {
			extend: 'Rob.view.Object',
			alias: "widget." + name,
			objectKind: name,
			addedFields: [],
			id: name,
		}, function() {
		});
	},

	/**
	 * Adds this very entry id to the 
	 * attributes or relations 
	 * field. THIS TRIGGERS a call to define(), 
	 * updating the model and store.
	 * All left is to update the view, done in the lower part of this function
	 */
	addAttributeOrRelation: function(id) {
		var i = id.split('.');
		if (i[0] == "Attribute")
			this.set("attributes", Ext.String.arrayAdd(this.get("attributes"), id));
		else
			this.set("relations", Ext.String.arrayAdd(this.get("relations"), id));

		// Now Store and Model are updated

		var view = Ext.getCmp(this.get("sName"));
		if (view)
			view.addField(id);

		// And now the view

	},
	/**
	 * Simply removes this very entry id from the 
	 * attributes or relations 
	 * field. THIS TRIGGERS a call to define(), 
	 * updating the model and store. 
	 * All left is to update the view, done in the lower part of this function
	 */
	removeAttributeOrRelation: function(id) {
		var i = id.split('.');
		if (i[0] == "Attribute")
			this.set("attributes", Ext.String.arrayRem(this.get("attributes"), id));
		else
			this.set("relations", Ext.String.arrayRem(this.get("relations"), id));

		// Now Store and Model are updated

		var view = Ext.getCmp(this.get("sName"));
		if (view)
			view.removeField(id);
		else
			console.log("Did not find the view :/");

		// And now the view

	},

	/*
	 * Format a dynamic string. Syntax: javascript, when accessing attribute values, use $<ATTRIBUTE NAME>
	 * e.g.
	 * $Vorname + " " + $Nachname -> record.get('id of Attribute Vorname') + " " + record.get('id of attribute Nachname')
	 *
	 * CAVE: case sensitive
	 */
	formatField: function(name, record) {
		var ret = this.get(name) || "";
		var attribs = this.get("attributes");

		if (Ext.isEmpty(attribs))
			return record.get("name");

		try {
			Ext.each(attribs.split(" "), function(attrib) {
				attrib=attrib.split('.')[1];
				attrib=Ext.getStore("Attribute").findExactRecord("id", attrib);
				var re = new RegExp('\\$' + attrib.get("name"),"g");
				var val = record.get(attrib.get("id"));
				if (val == "") throw new Error("(Non Fatal) One or Mulitple Variables not set in " + name + " of " + record.get("name"));
				ret=ret.replace(re, 'record.get("' + attrib.get("id") + '")');
			});

			ret=ret.replace(/\$Name/g, 'record.get("name")')
			ret=eval(ret);
		} catch (e) {
			console.log(e);
			console.log("Could not format " + attribs);
			ret=record.get("name");
		}
		return ret;
	},

	getRelations: function() {
		var edges = this.get("relations");
		edges = edges.replace(/Relation./g, '');
		return edges.split(" ");
	},

});

