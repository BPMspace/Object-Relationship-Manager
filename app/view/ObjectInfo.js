Ext.define('Rob.view.ObjectInfo', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.objinfo',
	id: "objectInfo",

	// This is a TODO
	// at one point of the merge 
	// delete the loadObjects function,
	// which should use the global store
	// set by the StarfieldSimulation Code
	setCumNodesStore: function(store) {
		this.items.getAt(1).bindStore(store);
		this.loadEdgeInstances();
 	},

	loadObjects: function() {
		var attribs= Ext.create('Ext.data.ArrayStore', { fields: [ 'id', 'name', 'type', 'storename'] });
		var tmp = [];
		Ext.getStore("Object").each(function(objectKind) {
			var type = objectKind.get("name");	
			var storename = objectKind.get("sName");
			Ext.getStore(storename).each(function(objectInstance) {
				tmp.push([objectInstance.get("id"), objectInstance.get("name"), type, storename]);
			});
		});
		attribs.loadData(tmp);
		this.items.getAt(1).bindStore(attribs);
	},

	loadEdgeInstances: function() {
		var cumEdgesStore = Ext.create('Ext.data.ArrayStore', { fields: [ 'fromid', 'toid', 'name_ab', 'name_ba', 'relationid'] });
		var tmp = [];
		Ext.getStore("Relation").each(function(relation) {
			var storename_ab = relation.get("kind");
			var storename_ba = Ext.getStore("Object").findExactRecord("id", relation.get("to")).get("sName");
			Ext.getStore(storename_ab).each(function(objectInstance) {
				var ids = objectInstance.get(relation.get("id"));
				if (ids) {
					Ext.each(ids.split(" "), function(item) {
						name_b = Ext.getStore(storename_ba).findExactRecord("id", item).get("name");
						tmp.push([objectInstance.get("name"), name_b, relation.get("name_ab"), relation.get("name_ba"), relation.get("id")]);
					});
				}
			});
		});
		cumEdgesStore.loadData(tmp);
		this.items.getAt(3).bindStore(cumEdgesStore);
 	},
 
	items: [ {
		xtype:'grid',
		title: 'Objects',
		features: [
			Ext.create('Ext.ux.grid.FiltersFeature', {
				local: true,
				filters: [{
					type: 'string',
					dataIndex: 'name',
				}]
			})
		],
		height: 200,
		width: 400,
		store: "Object",

		columns: [
			{header: 'ID', dataIndex: 'id', sortable: true},
			{header: 'Name', dataIndex: 'name', flex: true, sortable: true, filterable: true, },
		],
	}, {
		xtype:'grid',
		title: 'Object Instances',
		height: 200,
		width: 400,
		store: [["Loading", ""]],

		columns: [
			{header: 'ID', dataIndex: 'id', sortable: true}, 
			{header: 'Name', dataIndex: 'name', flex: true, sortable: true}, 
			{header: 'Class', dataIndex: 'type', flex: true, sortable: true}, 
			{
				xtype:'actioncolumn',
				width:30,
				items: [{
					icon: 'images/delete.png',
					tooltip: 'Delete',
					sortable: false,
					handler: function(gridcell, rowIndex, colIndex) {
						var rec = gridcell.getStore().getAt(rowIndex);
						Ext.getCmp("objectInfo").fireEvent("removeInstanceIconClick", gridcell, rec.get("id"), rec.get("storename"), function() {
							gridcell.getStore().removeAt(rowIndex);
						});
					}
				}]
			},
		],
	}, {
		xtype:'grid',
		title: 'Relations',
		height: 200,
		width: 400,
		//selModel: Ext.create('Ext.selection.CheckboxModel'),
		store: 'Relation',

		columns: [
			{header: 'ID', dataIndex: 'id', sortable: false}, 
			{header: 'Source Name', dataIndex: 'name_ab', flex: true, sortable: false}, 
			{header: 'Destination Name', dataIndex: 'name_ba', flex: true, sortable: false}, 
			{header: 'Source Object', dataIndex: 'from', flex: true, sortable: false, xtype: 'namecolumn'}, 
			{header: 'Destination Object', dataIndex: 'to', flex: true, sortable: false, xtype: 'namecolumn'},
			{
				xtype:'actioncolumn',
				width:30,
				items: [{
					icon: 'images/delete.png',
					tooltip: 'Delete',
					sortable: false,
					handler: function(gridcell, rowIndex, colIndex) {
						var rec = gridcell.getStore().getAt(rowIndex);
						Ext.getCmp("objectInfo").fireEvent("relationDelete", "Relation." + rec.get("id"), rec.get("from"));
					}
				}]
			},
		],
	}, {
		xtype:'grid',
		title: 'Relation Instances',
		height: 200,
		width: 400,
		store: [["Loading", ""]],

		columns: [
			{header: 'ID', dataIndex: 'relationid', sortable: true},
			{header: 'Name', dataIndex: 'fromid', flex: true, sortable: true},
			{header: 'Class', dataIndex: 'name_ab', flex: true, sortable: true},
			{header: 'To Name', dataIndex: 'toid', flex: true, sortable: true},
			{header: 'Class', dataIndex: 'name_ba', flex: true, sortable: true},
			{
				xtype:'actioncolumn',
				width:30,
				items: [{
					icon: 'images/delete.png',
					tooltip: 'Delete',
					sortable: false,
					handler: function(gridcell, rowIndex, colIndex) {
						var rec = gridcell.getStore().getAt(rowIndex);
						Ext.getCmp("objectInfo").fireEvent("removeRelationInstanceIconClick", gridcell, rec.get("fromid"), rec.get("toid"), rec.get("relationid"), rec.get("storename"), function() {
							gridcell.getStore().removeAt(rowIndex);
						});
					}
				}]
			},
		],
	}],

});
