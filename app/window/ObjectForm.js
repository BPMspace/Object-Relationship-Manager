Ext.define('Rob.window.ObjectForm', {
	extend: 'Ext.window.Window',
	title: 'Create a new Object class',
	id: "objectForm",
	autoScroll: true,
	width: 400,

	items: [{
		xtype: 'form',
		autoScroll: true,
		height: 300,
		flex: 1,
		items: [{
			xtype: 'textfield',
			fieldLabel: "Object Name",
			name: 'name',
	        // CUSTOM VALIDATION: Store.findExact
	        allowBlank: false,
	        vtype: 'objectDefined',
		}, {
			xtype: 'combo',
			fieldLabel: 'Copy Object',
			// Arrange radio buttons into two columns, distributed vertically
			valueField: "id",
			displayField: "name",
			store: Ext.getStore("Object"),
			listeners: {
				select: function(combo, records) {
					var items = records[0].get("attributes").replace(/Attribute./g, "");
					this.next().setValue(items);
				}
			},
		}, {
			xtype: "loadablegrid",
			store: Ext.getStore("Attribute"),
			selModel: Ext.create('Ext.selection.CheckboxModel'),
			id: "objectCopyGrid",
			forceFit: true,
			height: 200,
			columns: [
				{ header: 'Name',  dataIndex: 'name'},
			]
		}],
		buttons: [{
			text: 'Save',
			id: 'newObjectSave',
			formBind: true,
			listeners: {
				click: function() {
					var form = this.up("form").getForm();
					var grid = Ext.getCmp("objectCopyGrid");
					var sel = grid.getSelectionModel().getSelection();

					var obj = Ext.create("Rob.model.Object");
					form.updateRecord(obj);

					var table = obj.get("name").toLowerCase().replace(/[^\w]/g, "_");
					obj.set("sName", table);

					var attribs = [];
					var ids = [];
					for (var r in sel) {
						var c = sel[r].copy();
						c.set("id", Ext.create("Rob.util.CustomIdGenerator").generate());
						ids.push("Attribute." + c.get("id"));
						attribs.push(c);
					}

					obj.set("attributes", ids.join(" "));

					Ext.Ajax.request({
						url: bcknd + 'bcknd/fn.php?fn=define&table=' + table,
						success: function(response, opts) {
							Ext.getStore("Attribute").add(attribs);
							Ext.getStore("Attribute").sync();
							Ext.getStore("Object").add(obj);
							Ext.getStore("Object").sync();
							console.log("Created Object " + obj.get("name"));
						},
						failure: function(response, opts) {
							console.log("Could not create Object " + obj.get("name"));
						}
					});
					this.up("window").close();
				},
			},
		}]
	}],
});
