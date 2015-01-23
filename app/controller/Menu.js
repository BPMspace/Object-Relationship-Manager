// This contols both the 
// StarfieldSimulation and the ObjectInfo 
// views.
Ext.define('Rob.controller.Menu', {
	extend: 'Ext.app.Controller',

	refs: [{
		ref: 'edit',
		selector: '[id=objectEdit]'
	}, {
		ref: 'nav',
		selector: '[id=nav-region]'
	}],

	init: function() {
		this.control({
			'[id=tbMenu]': {
				click: this.onTbMenuClick,
			}, 
			'hrefcolumn': {
				click: this.lala,
			},
		});
	},

	lala: function() {
		console.log("a");	
	},

	onTbMenuClick: function(menu, item, e, ops) {
		switch(item.action) {
			case 'im': 
				Ext.create("Rob.window.Import").show(); 
				break;
			case 'ex': 
				Ext.create("Rob.window.Export").show(); 
				break;
			case 'addn': 
				Ext.create("Rob.window.ObjectForm").show();
				break;
			case 'adde': 
			case 'edn': 
			case 'ede': 
				Ext.getCmp("objectEdit").setActiveTab("objectDragGridRelations");
				this.getNav().fireEvent("changePage", this, 2);
				break;
			case 'rm': 
				var node = Ext.getCmp("nav-region").getSelectionModel().getSelection();
				if (node.length == 0) return;
				node = node[0];
				if (node.isLeaf()) return;
				var sName = node.get("id");
				var record = Ext.getStore("Object").findExactRecord("sName", sName);
				Ext.getCmp("nav-region").fireEvent("menuDelteObject", menu, record.get("id"));
				break;
			default:
				break;
		}
		menu.up().hideMenu();
	}

});

