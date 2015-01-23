/**
 * An implementation of a proxy, that reads data from our various stores
 * and feeds that back into the TreeStore.
 * The Tree view is included below.
 */
Ext.define('Rob.proxy.StoreReader', {
	alias: 'proxy.storereader',
    extend: 'Ext.data.proxy.Memory',

	getNodeDisplayName: function(object, record) {
		if (object.get("displayname") == "")
			return record.get("name");
		return object.formatField('displayname', record);
	},

	read: function(operation, callback, scope) {
		var node = operation.node;
		console.log(node);
		if (!node)
			throw("Somethings wrong");
		
		var store = Ext.getStore(node.get('id'));
		var object = Ext.getStore("Object").findRecord("sName", node.get('id'), 0, false, false, true);
		var res = [];
		if (!store)
			throw("Somethings wrong");
		var data = ({
			text: "New Item",
			icon: 'extjs/resources/themes/images/default/tree/drop-add.gif',
			id: node.get('id') + "_new",
			store: node.get('id'),
			leaf: true,
		});
		res.push(this.model.create(data, data.id, data));
		store.each(function(item) {
			data = ({
				text: this.getNodeDisplayName(object, item),
				id: item.get('id'),
				store: node.get('id'),
				leaf: true,
			});
			res.push(this.model.create(data, data.id, data));
		}, this);
		operation.resultSet = Ext.create('Ext.data.ResultSet', {
			records: res,
			total  : res.length,
			loaded : true
		});
		operation.setCompleted();
		operation.setSuccessful();
		Ext.callback(callback, scope || this, [operation]);
	},

});


Ext.define('Rob.view.Tree', {
	extend: 'Ext.container.Container',
	alias: 'widget.tree',

	layout: 'vbox',
	width: 290,
	margin: "0 10 0 0",
	items: [{
		xtype: 'toolbar',
		width: 290,
		items: [{
			xtype:'treetextfilter',
			itemId:'textfilter',
			id: 'globalsearchbar',
			emptyText:'Enter search terms',
			tree: "nav-region",
			store: [],
			_reselectNode:false,
			filterFn:function(node){
				var re = new RegExp(Ext.escapeRe(this.value), 'i');
                //console.log(node.data.text + " -> " + re.test(node.data.text));
                return re.test(node.data.text);
			},
			//Reselect the node that was selected before filtering.
			beforeClearFilter:function(){
				this._reselectNode = this.tree.getSelectionModel().getSelection()[0] || false;
			},
			afterClearFilter:function(){
				this.tree.collapseAll();
				if(this._reselectNode){ this.tree.expandPath(this._reselectNode.getPath()); this.tree.getSelectionModel().select(this._reselectNode); }
				else{ this.tree.expandPath('/root/node-id-overdue'); }
				this.fireEvent("TreeStoreUnfiltered");
			}
		}, {
			xtype:'tbspacer',
			flex:1
		}, {
			text: 'Graph View',
			enableToggle: true,
			align: 'right',
			id: 'tbGraphView',
		}, {
			icon: 'images/config.png',
			scale: 'small',
			align: 'right',
			id: 'tbMenuBtn',
			menu: { xtype: 'rmenu' },
		}]
	}, {
		xtype: 'treepanel',
		viewType:'treefilteringview',
		flex: 1,
		id: 'nav-region',
		store: Ext.create('Ext.data.TreeStore', {
			autoLoad: true,
			storeId: 'Tree',
			proxy: {
				type: 'storereader',
			},
			root: {
				text: 'ORM',
				id: 'root',
				leaf: false,
				loaded: true,
				expanded: true
			},
		}),
	}]
});
