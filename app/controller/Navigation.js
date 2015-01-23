Ext.define('Rob.controller.Navigation', {
	extend: 'Ext.app.Controller',
	lazyInit: new Ext.util.HashMap(),

	refs: [{
			ref: 'nav',
			selector: '[id=nav-content]'
		}, {
			ref: 'tree',
			selector: '[id=nav-region]'
	}],

	initHistoryNavigation: function() {

		var t = Ext.History.getToken();
		if (t) {
			this.application.on('DoneLoadingObject', function() { Ext.History.fireEvent("change", t); }, this, { single: true, delay: 100, });
		}

		Ext.History.on("change", function(token, opts) {
			console.log("Changed to " + token);
			this.selectHistoryNode(token, opts);
		}, this);
	},

	init: function() {
		Ext.History.on("ready", function(token, opts) {
			this.initHistoryNavigation();
		}, this);
		this.control({
			'[id=nav-region]': {
				itemclick: Ext.Function.alias(this, 'onItemClick'),//same function as this.onItemClick, but does work with jasmine
				load: Ext.Function.createBuffered(this.treeload, 100, this),
				invalidateView: Ext.Function.alias(this, "onInvalidateView"),
				changePage: Ext.Function.alias(this,"onItemClick"),
			},
			'[id=tbGraphView]': {
				toggle: this.onToggleGraphView,
			},
		});
		this.application.on({
			"ObjectClassCreated": { fn: this.onAddObject, scope: this },
			"ObjectClassRemoved": { fn: this.onRemoveObject, scope: this },
			// For the jasmine tests :/
			//"ObjectInstanceRemoved": { fn: this.reloadFolder, scope: this, type: "remove" },
			"ObjectInstanceRemoved": { fn: Ext.Function.alias(this, "reloadFolder"), scope: this, type: "remove" },
			"ObjectInstanceCreated": { fn: this.reloadFolder, scope: this, type: "create" },
			"ObjectInstanceChanged": { fn: this.reloadFolder, scope: this, type: "change" },
		});
	},

	reloadFolder: function(record, store, opt, extra) {
		var root = this.getTree().getRootNode();
		var node = root.findChild("id", store);
		if (!node) 
			return;

		var cb = function() { };

		if (Ext.History.getToken().match(/_new$/) && (extra.type == "create")) {
			cb = function() {
				Ext.History.add("/root/" + store + "/" + record.get("id"));
			}
		} else if (extra.type == "remove") {
			cb = function() {
				Ext.History.add("/root/" + store + "/" + store + "_new");
			}
		}
		Ext.getStore("Tree").load({ node: node, callback: cb });
	},

	treeload: function(view, record, item, index, event) {
		var path = Ext.History.getToken();
		console.log("TREELOAD " + path);

		if (Ext.isEmpty(path))
			return;
		this.getTree().selectPath(path);

	},
	// Function to select treelimb based on link after reloading the page (F5) and after history change
	// Not the perfect solution, free for changes etc.

	selectHistoryNode: function (token, opts) {
		var elements = token.split("/");
			token = token.replace(/\/$/, "");
			switch (elements[1]) {
				case "root":
					this.getTree().selectPath(token, undefined, undefined, 
						function(success, node) { 
							if (success)
								this.switchPage(node);
							else
								console.log("The Object was not found");
						}, this);
					break;
				case "graph":
					token=token.replace("graph", "root");
					r=this.getTree().getRootNode();
					r.childNodes.forEach(function(node) {
						if (node.get("id") == elements[2])
							return true;
						node.collapse();
					});
					this.getTree().selectPath(token, undefined, undefined, undefined);
					break;
				default:
					break;
			}
	},
	checkParentNode: function(record) {
		var storeName = record.data.parentId;
		if (!this.getNav().getComponent(storeName) && (!this.lazyInit.get(storeName)))
			return false;

		var store = Ext.getStore(storeName);
		if (!store) {
			console.log("Problem: Can not find store " + storeName + " for node " + p);
			return false;
		}

		var o;
		if (o = this.lazyInit.get(storeName)) {
			this.getNav().add(o);
			this.lazyInit.removeAtKey(storeName);
		}

		var r = store.findExactRecord("id", record.data.id);
		this.getNav().layout.setActiveItem(storeName);

		if (!r) {
			var initialConfig = {};
			var objectClass = Ext.getStore("Object").findExactRecord("sName", storeName);
			var attribStore = Ext.getStore("Attribute");

			Ext.each(objectClass.get("attributes").split(" "), function(item) {
				if (item == "")
					return true;
				var attrib = attribStore.findExactRecord("id", item.split(".")[1]);
				var d = attrib.get("fieldDefaults");
				if (d) {
					initialConfig[attrib.get("id")] = d;
				}
			});
			r = Ext.create("Rob.model." + storeName, initialConfig);
			this.getNav().layout.getActiveItem().getForm().reset();
		}

		this.getNav().layout.getActiveItem().loadRecord(r);
		return true;
	},

	onItemClick: function(view, node, item, index, event) {

		var activeView = this.getNav().layout.getActiveItem();
		if (typeof (activeView.isDirty) === 'function' && activeView.isDirty()) {

			Ext.Msg.show({
				title:'Leave Page?',
				msg: 'You have made changes on this Page. Save them before leaving?',
				buttons: Ext.Msg.YESNOCANCEL,
				icon: Ext.Msg.QUESTION,
				fn: function(buttonid) {
					if (buttonid == "cancel") {
						return;
					}
					if (buttonid == "yes") {
						// SAVE. Wenn was schiefgeht wirds nicht abgefangen. Ist schwer :/
						activeView.store();
					}
					if (typeof(node.getPath) === "function")
						Ext.History.add(node.getPath());
					else
						this.switchPage(node);
				},
				scope: this,
			});

		} else {
			if (typeof(node.getPath) === "function")
				Ext.History.add(node.getPath());
			else
				this.switchPage(node);
		}
	},

	switchPage: function(record) {
		if (!record)
			return;

		// Navigate IN this view, using the tree
		if (this.getNav().layout.getActiveItem().id == "objectEdit") {
			if(Ext.isObject(record) && !record.isLeaf()) Ext.getCmp("objectEdit").switchToCurrentNavItem();
		}
		// Necessary to reload current data when navigating from object to object
		if (this.getNav().layout.getActiveItem().id == "instinfo") {
			if(Ext.isObject(record) && !record.isLeaf()) Ext.getCmp("instinfo").switchToCurrentNavItem();
		}
		if (this.getNav().layout.getActiveItem().id == "graph") {
			Ext.getCmp("tbGraphView").toggle(false, true);
		}

		if (Ext.isObject(record)) {
			if (record.isLeaf())
			{
				console.log("In CheckParentNode");
				this.checkParentNode(record);
			}
			else
				//instinfo = 4th card item
				Ext.getCmp("nav-content").layout.setActiveItem(3);
		} else {
			console.log("In Else Node");
			Ext.getCmp("nav-content").layout.setActiveItem(record);

		}
	},

	onRemoveObject: function(name) {
		var root = this.getTree().getRootNode();
		var node = root.findChild("id", name);
		if (node) root.removeChild(node);
	},

	onAddObject: function(id, name) {
		console.log("Here register " + name + " in the TreeView");
		var lcName = name;
		var fName = Ext.getStore("Object").getAt(
			Ext.getStore("Object").findExact("sName", name)
		).get("name");

		var node = this.getTree().getRootNode().appendChild({leaf: false, text: fName, id: name});
		Ext.getStore("Tree").load({node: node});

		if (this.getNav().getComponent(name)) {
			console.log("Strange, " + name + " already defined");
		} else {
			// LAZY Create the view (IMPORTANT FOR CIRCULAR DEPENDENCIES OF STORES IN RELATIONS)
			this.lazyInit.add(name, {xtype: name, id: name});
		}
	},

	onToggleGraphView: function(button, active) {
		if (active) 
			Ext.getCmp("nav-content").layout.setActiveItem(1);
		else
			Ext.getCmp("nav-content").layout.setActiveItem(0);
	},

	// Signal fired to refresh all Relation/Attributes
	onInvalidateView: function(name) {
		console.log("Invalidate " + name);

	//	var folder = this.getTree().getRootNode().findChild("id", name);
	//	if (folder) Ext.getStore("Tree").load({node: folder});

		var view = this.getNav().getComponent(name);
		if (!view) return;

		this.getNav().remove(view).destroy();
		this.lazyInit.add(name, {xtype: name, id: name});
	},
});

