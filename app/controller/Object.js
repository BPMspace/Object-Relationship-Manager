/**
 * Receives Object related events.
 * Adding, Removing Relations, Attributes happens here
 */
Ext.define('Rob.controller.Object', {
	extend: 'Ext.app.Controller',

    stores: ['Object'],

	init: function() {
		this.control({
			'[action=attributeSave]': {
				click: this.onSaveAttributes,
			},
			'[action=EditAttributeSave]':{
				click: this.onEditSaveAttributes,
			},
			'[action=relationSave]': {
				click: this.onSaveRelation,
			},
			'aform radiogroup': {
				change: this.attribClick,
			},
			'[action=objectAddAttribute]': {
				click: this.onAddAttribute,
			},
			
			'rform combo' : {
				targetObjectSelected: this.ontargetObjectSelected,
			},
			'rform radiogroup': {
				change: this.changeRelationCardinality,
			},
			'[id=objectInfo]': {
				relationDelete: this.onDeleteRelation,
			},
			'[id=objectDragGridRelations]': { // This is the icon IN the grid
				attributeDelete: this.onDeleteAttributeRelation,
			},
			'[id=objectDragGridAttributes]': { // This is the icon IN the grid
				attributeDelete: this.onDeleteAttributeRelation,

				attributeEdit: 	 this.onEditAttributeRelation,

				itemdblclick: this.onAttributeGridDblclick,
			},
			'[id=nav-region]': {
				menuDelteObject: this.onMenuObjectDeleteClass,
			},
			'[action=objectDeleteClass]': {
				click: this.onObjectDeleteClass,
			},
			'[action=objectDeleteClass]': {
				click: this.onObjectDeleteClass,
			},
			'[action=objectSaveClass]': {
				click: this.onObjectSaveClass,
			},
			'[action=objectAddRelation]': {
				click: this.onAddRelation,
			},
		});

	},

	onAddRelation: function(view, event, key, value) {
		this.onAddAttributeOrRelation(view, event, key, value, "rform", "Relation");
	},

	onAddAttribute: function(view, event, key, value) {
		return this.onAddAttributeOrRelation(view, event, key, value, "aform", "Attribute");
	},

	onAddAttributeOrRelation: function(view, event, key, value, xt, name) {
		var sName = (view.up("window") ? view.up("window").down("form").id : view.up("object").id);
		return this.showAddAttributeOrRelationWindow(xt, name, sName);
		
	},

	showAddAttributeOrRelationWindow: function(xt, name, sName) {
		
		var form;
		if(xt=="aform")
		{
			form = Ext.create("Rob.view.AttributeForm");
		}
		else  form= Ext.create("Rob.view.RelationForm");

		var w = Ext.create('Ext.window.Window', {
			width: 800,
			height: 300,
			title: 'Add an ' + name,
			layout: 'fit',
			items: [form],
		});
		if(name=="Relation")
		{
			var record = Ext.getStore("Object").findExactRecord("sName",sName);
			if(record)
			{
			
				w.down("[name=displayObject]").setValue(record.data.name);
				w.down("[name=displayObject2]").setValue(record.data.name);

			}
			else
			{
				w.down("[name=displayObject]").setValue(record.data.sName);
				w.down("[name=displayObject2]").setValue(record.data.sName);

			}


		}
		else
		{
		form.getDockedComponent('attributeToolbar').add({
   		xtype:'button', width:70,
		text: "Save", name: 'SaveAddButton', action:'attributeSave', formBind:true,
		handler: function(){
			this.up("window").close();
			}
   		
 
		})
		}
		// Set the kind in the hidden kind value
		w.down("[name=kind]").setValue(sName);
		return w.show();
	},

	onSaveRelation: function(button, ev, ops) {
		this.onSaveAttributeOrRelation(button, ev, ops, "Relation");
	},

	onSaveAttributes: function(button, ev, ops) {
		this.onSaveAttributeOrRelation(button, ev, ops, "Attribute");
	},

	// TODO: model.addAttributeOrRelation() should exist and be called
	onSaveAttributeOrRelation: function(button, ev, ops, type) {
		// The relation record
		var record = Ext.create("Rob.model." + type);
		button.up("window").down("form").getForm().updateRecord(record);

		var r = Ext.getStore('Object').findExactRecord("sName", record.data.kind);

		// Die ID des Quellobjekts eintragen, damit InRelations gehen
		record.set("from", r.get("id"));

		var id = type + "." + record.get("id");

		var relationPartnerName = "empty";
		if (type == "Relation") {  // Adds InRelation to the Target Objects attribs
			var relationPartner = Ext.getStore('Object').findExactRecord("id", record.data.to);
			relationPartnerName = relationPartner.get("sName");

			var inrelationid = "InRelation." + record.data.id;

			// Insert into the to Relation
			relationPartner.set("relations", 
				Ext.String.arrayAdd( relationPartner.get("relations"), inrelationid ) 
			);
		}

		Ext.getStore(type).add(record);
		Ext.getStore(type).sync();

		if (type == "Relation") 
			type = "relations";
		else
			type = "attributes";

		// Insert into the from Relation
		r.set(type, 
			Ext.String.arrayAdd( r.get(type), id ) 
		);

		// Update the views
		Ext.getCmp("nav-region").fireEvent("invalidateView", record.data.kind);
		Ext.getCmp("nav-region").fireEvent("invalidateView", relationPartnerName);
		// Reload the current view
		var t=Ext.History.getToken();
		Ext.getStore(record.data.kind).on({load: { fn: function() { Ext.History.fireEvent("change", t); }, single: true} } );
	},
	
	onEditSaveAttributes: function (button, ev, ops){
		//Get Attribute Record and Dropdown List Record
		var aform=button.up("window").down("form");
		var form=aform.getForm();
		var attribRecord = form.getRecord();
		if(attribRecord.data.type=="wrlist")
		{
		var wrlistRecord = Ext.getStore("RobList").findExactRecord("id", attribRecord.data.params);
		
		}
		
		if (attribRecord)
		{
			form.updateRecord(attribRecord);
			var objectRecord = Ext.getStore("Object").findExactRecord("sName", attribRecord.data.kind)	;
			console.log(attribRecord);
			if(objectRecord)
			{
				Ext.getCmp('objectEdit').loadObject(objectRecord);

			}
			else return;
			
			}
		else
		{
			console.log("Updating Attribute not successful!");
		}
		
	},

	attribClick: function(item, newValue, oldValue) {
		var v = item.up("aform").down("[name=fieldDefaultsContainer]");
		v.removeAll(true);
		if (newValue.type == "wrlist") {
			var w=item.up("aform");
			//var attribName = w.name;
			var attribName = w.down("[name=name]").getValue();
				v.add({
				xtype: "redit",
				name: 'params',
				attribName: attribName + "-" + w.down("[name=kind]").getValue(),
			});
		} else {
			v.add({ xtype: newValue.type, fieldLabel: "Default Value", name: 'fieldDefaults' });
		}
		v.expand();
	},

	// TODO: move Relations to ReferenceManager
	deleteAttribute: function(id, record) {

		if (id == "")
			return;

		var s = id.split('.');
		var type = s[0]; // If its an Attrib/[In]Relation
		var subid = s[1]; // The ID of the Attrib/Relation/InRelation

		// If its a relation it has a second endpoint
		// search it and remove this as well
		if (type != "Attribute") {
			var relation = Ext.getStore("Relation").findExactRecord("id", subid);
			var toid = (type == "Relation") ? relation.get("to") : relation.get("from");
			var fromid = (type == "Relation") ? relation.get("from") : relation.get("to");
			// Now we get the Object, that Relation is pointing to
			var toRecord = this.getObjectStore().findExactRecord("id", toid);
			// This is the thing to ignore
			var removeMe = (type=="Relation") ? "InRelation." + subid  : "Relation." + subid;

			toRecord.removeAttributeOrRelation(removeMe);
			if (!record) record = this.getObjectStore().findExactRecord("id", fromid);
		}
		if (type == "InRelation") type = "Relation";

		// Remove the item from the attributes or relations fields and the view
		record.removeAttributeOrRelation(id);

		// Finally remove the actual Attribute
		Ext.getStore(type).removeAt(
			Ext.getStore(type).findExact("id", subid)
		);
	},

	onDeleteRelation: function(id, oid) {
		if (oid == "")
			return;
		var record = this.getObjectStore().findExactRecord("id", oid);
		this.deleteAttribute(id, record);
	},

	onDeleteAttributeRelation: function(cmp, id, oid) {
		if (oid == "")
			return;
		var record = this.getObjectStore().findExactRecord("id", oid);
		this.deleteAttribute(id, record);
		Ext.getCmp("objectEdit").loadObject(record);
	},
	onEditAttributeRelation:function (cmp,id,oid) {
		if (oid == "")
			return;
		var split= id.split(".");
		var attrStore = Ext.getStore('Attribute').findExactRecord("id", split[1]);
		 	
		this.showEditWindow(attrStore);

	},

	onObjectSaveClass: function(view, event, key, value) {
		var cmp = Ext.getCmp("objectEdit");
		var oid = cmp.objectId;
		var sort_att = Ext.getCmp("objectDragGridAttributes").sorting;
		var sort_rel = Ext.getCmp("objectDragGridRelations").sorting;

		// RESORTING
		var record = this.getObjectStore().findExactRecord("id", oid);
		record.set("attributes", sort_att.join(" "));
		record.set("relations", sort_rel.join(" "));

		// RENAMING ATTRIBUTES
		Ext.getCmp("objectDragGridAttributes").store.each(function(item) {
			// It has been renamed, oh boy..
			if (item.dirty) {
				var name = item.get("field1");
				var key = item.get("field2").split('.');
				var id = key[1];

				var r= Ext.getStore("Attribute").findExactRecord("id", id);
				r.set("name", name);
			}
		});
		// RENAMING RELATIONS
		Ext.getCmp("objectDragGridRelations").store.each(function(item) {
			// It has been renamed, oh boy..
			if (item.dirty) {
				var name = item.get("field1");
				var key = item.get("field2").split('.');
				var cardinality = item.get("field3");
				var type = key[0];
				var id = key[1];

				var r= Ext.getStore("Relation").findExactRecord("id", id);
				r.set((type == "Relation") ? "name_ab" : "name_ba", name);
				r.set("cardinality", cardinality);

				// Force Relayout of the relation's otherside view
				if (oid == r.get("from"))
					r = this.getObjectStore().findExactRecord("id", r.get("to"));
				else
					r = this.getObjectStore().findExactRecord("id", r.get("from"));

				Ext.getCmp("nav-region").fireEvent("invalidateView", r.get("sName"));
			}
		});
		Ext.getCmp("objectExtras").getForm().updateRecord(record);

		cmp.loadObject(record);
		Ext.getCmp("nav-region").fireEvent("invalidateView", record.get("sName"));
	},

	onObjectDeleteClass: function(view, event, key, value) {
		var cmp = Ext.getCmp("objectEdit");
		var oid = cmp.objectId;
		this.beforeObjectDeleteClass(oid);
	}, 

	onMenuObjectDeleteClass: function(menu, oid) {
		this.beforeObjectDeleteClass(oid);
	}, 

	beforeObjectDeleteClass: function(oid) {

		var record = this.getObjectStore().findExactRecord("id", oid);
		if (!record) {
			console.log("Hit an error, object id " + objectAddAttribute + "nonexistent");
			return;
		}

		Ext.Msg.show({
			title: 'Warning',
			msg:'Delete Object Class ' + record.get("name") + "?",
			buttons: Ext.Msg.OKCANCEL,
			icon: Ext.Msg.QUESTION,
			fn: function(buttonid) {
				if (buttonid == "ok") {
					this.objectDeleteClass(oid);
				}
			},
			scope: this,
		});

		return;

	},

	objectDeleteClass: function(oid) {
		var cmp = Ext.getCmp("objectEdit");
		var record = this.getObjectStore().findExactRecord("id", oid);

		if (!record) {
			console.log("Hit an error, object id " + objectAddAttribute + "nonexistent");
			return;
		}

		/* Here ALL ATTRIBUTES AND RELATIONS need to be deleted -.- */
		var items = (record.get("attributes") + " " + record.get("relations")).split(" ");
		Ext.each(items, function(item) {
			this.deleteAttribute(item, record);
		}, this);
		
		this.getObjectStore().remove(record);
		this.getObjectStore().sync();
		cmp.reset();
	},

	showEditWindow: function(record) {

		var aform = Ext.create('Rob.view.AttributeForm');

		// TODO RobLists do not load
		aform.loadRecord(record);
		aform.down("radiogroup").setReadOnly(true);
		var w = Ext.create('Ext.window.Window', {
			width: 800,
			height: 300,
			title: 'Edit Attribute',
			layout: 'fit',
			items: [aform],
			
		});

		aform.getDockedComponent('attributeToolbar').add({
		xtype: 'button', 
		width: 70,text: "Save", name: 'SaveEditButton', action:'EditAttributeSave', formBind:true,
		handler: function(){
			this.up("window").close();
			}
		//}]
		})
		w.show();
	},
	onAttributeGridDblclick: function(view, record, dom, idx, e, ops) {
		var record = Ext.getStore('Attribute').findExactRecord("id", record.get("field2").split(".")[1]);
		if (!record) return;
		this.showEditWindow(record);
	},
	ontargetObjectSelected: function(window,value){
		window.down("[name=displayTargetObject]").setValue(value);
	},
	
	
	// Function for RelationForm
	//Sets cardinality based on user input
	//bad programming, partwise obsolete
	changeRelationCardinality: function(item, newValue, oldValue)
	{
		//need to get the value (=object) as a string (or int) to be able to compare in if
		var newValue_string =JSON.stringify(newValue);
		var split= newValue_string.split(":");
		
		// not a good way to solve, alternatives?
		var splitCard = split[1].substring(1,2);
		var splitCard2 = split[1].substring(2,3);
		var array = Ext.ComponentQuery.query('displayfield[name=displaySentence]');
		var string1 = "Exactly one";
		var string2 = "One or more"
		if (splitCard=="1")
		{
			if(splitCard2=="1")
			{
				Ext.Array.each(array,function(item){
				item.setValue(string1);
				})
			}
			else 
			{
				var flag;
				Ext.Array.each(array,function(item){
				if (flag)
				{
					item.setValue(string1);
					flag=false;
				}
				else 
				{
				item.setValue(string2);
				flag=true;
				}
				})
			}		
		
		}
		else
		{
			if(splitCard2=="n")
			{
				Ext.Array.each(array,function(item){
				item.setValue(string2);
				})
			}
			else
			{
				var flag;
				Ext.Array.each(array,function(item){
				if (flag)
				{
					item.setValue(string2);
					flag=false;
				}
				else 
				{
				item.setValue(string1);
				flag=true;
				}
				})
			}
		}
		
	}
});

