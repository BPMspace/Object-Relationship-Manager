Ext.define('Rob.view.ObjectEdit', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.objedit',
	id: "objectEdit",
	objectId: "", // The id of the current displayed object
	
	// filters 
	mixins: {
		filter: 'Ext.ux.grid.FiltersFeature',
	},
	initComponent: function() {
		this.callParent();
		this.tabBar.insert(0, {
			xtype: 'xcombo',
			fieldLabel: '&nbsp Select Object',
			// Arrange radio buttons into two columns, distributed vertically
			valueField: "id",
			displayField: "name",
			allowBlank: false,
			store: Ext.getStore("Object"),
			listeners: {
				select: function(combo, records) {
					Ext.getCmp("objectEdit").loadObject(records[0]);
				}
			},
			trigger2Click: function() {
				Ext.getCmp("objectEdit").down("[action=objectDeleteClass]").fireEvent("click");
			},
		});
	},

	switchToCurrentNavItem: function() {
		// TODO never called?
		// TODO replace
		var node = Ext.getCmp("nav-region").getSelectionModel().getSelection()[0];

		if (!Ext.isObject(node)) 
			return;

		if (node.isLeaf()) 
			node=node.parentNode;

		if (node.getPath() == "/root")
			return;

		var record = Ext.getStore("Object").findExactRecord("sName", node.get("id"))

		this.tabBar.items.first().select(record);
		this.loadObject(record); // WORKAROUND select event does not fire
	},

	listeners: {
		beforeshow: function() {
			this.switchToCurrentNavItem();
		},
	},

	sorting: [],

	items: [ {
		
		features: [{
                ftype: 'filters',
                encode: false,
                local: true,
            }],
		xtype:'grid',
		title: 'Attributes',
		id: "objectDragGridAttributes",
		height: 200,
		width: 400,
		store: [["Please select an Object", ""]],

		columns: [
			{
				header: 'Name', dataIndex: 'field1', flex: true, filter: {
                type: 'string',
                disabled: false,
            }
			}, {
				header: 'Type', dataIndex: 'field4',
				sortable: true,
				filter:{
					type:'list',
					//filters Type column with list 
					options:["Date/Time","TRUE/FALSE","List","Drop Down List","Freitext","Richtext","Number"],
				},
				editor: {
					xtype: 'label',
					editable:false,
					validator: function(value){
						var ok = ["xdatetime", "checkbox", "wlist", "wrlist", "textfield", "htmleditor","numberfield", "wdate"];
						if(Ext.Array.contains(ok, value)) {
							return true;
						} else {
							return 'Error! Value must be one of ' + ok;
						}
						return false;
					}
				}
			}, {
				xtype:'actioncolumn',
				width:50,
				editable:false,
				sortable:false,
				 /*renderer: function (value, metadata, record) {
				 	var rec= record.get('field2');
				 	var split= rec.split(".");
				 	var attrStore = Ext.getStore('Attribute').findExactRecord("id", split[1]);
				 	if (!attrStore) return;
       			 if (attrStore.data.type =="wrlist") {
		            Ext.getCmp("objectDragGridAttributes").columns[2].items[0].icon = 'images/edit.png';
		        } else {
		            Ext.getCmp("objectDragGridAttributes").columns[2].items[0].icon = '';
		        }
		    	},*/
					items: [{
					margin:10,
					icon: 'images/edit.png',
					tooltip: 'Edit',
					sortable: false,
					action: "attributeEdit",
					handler: function(grid, rowIndex, colIndex) {
						var rec = grid.getStore().getAt(rowIndex);
						
						grid = grid.up(); // Passed is not the grid we want
						grid.fireEvent("attributeEdit", grid, rec.get("field2"), Ext.getCmp("objectEdit").objectId);
					}
					},{
					icon: 'images/delete.png',
					tooltip: 'Delete',
					sortable: false,
					action: "attributeDelete",
					handler: function(grid, rowIndex, colIndex) {
						var rec = grid.getStore().getAt(rowIndex);
						grid = grid.up(); // Passed is not the grid we want
						grid.fireEvent("attributeDelete", grid, rec.get("field2"), Ext.getCmp("objectEdit").objectId);
					}
				}]
			},
		],
		viewConfig: {
			plugins: {
				ptype: 'gridviewdragdrop',
				dragText: 'Drag and drop to reorganize'
			},
			listeners: {
				drop: function (node, data, dropRecord, dropPosition) {
					var dragRecord = data.records[0];
					var new_sort = [];
					var dragID = dragRecord.get("field2");
					var dropID = dropRecord.get("field2");

					Ext.each(Ext.getCmp("objectDragGridAttributes").sorting, function(item) {
						if (item == dragID)
							return true;

						if ((item == dropID) && (dropPosition == "before"))
							new_sort.push(dragID);

						new_sort.push(item);

						if ((item == dropID) && (dropPosition == "after")) 
							new_sort.push(dragID);

					});
					Ext.getCmp("objectDragGridAttributes").sorting = new_sort;
				}
			}
		},
	}, {
		features: [{
                ftype: 'filters',
                encode: false,
                local: true,
            }],
		xtype:'grid',
		title: 'Relations',
		id: "objectDragGridRelations",
		height: 200,
		width: 400,
		store: [["Please select an Object", ""]],

		columns: [{
				header: 'Name', dataIndex: 'field1', flex: true,
				sortable: false,
				filter: {
                type: 'string',
                disabled: false,
            },
				editor: {
					xtype: 'textfield',
					allowBlank: false
				}
			}, {
				header: 'Cardinality', dataIndex: 'field3',
				sortable: false,
				filter:{
					type:'list',
					options:["11", "1n", "n1", "nn"]
				},
				editor: {
					xtype: 'textfield',
					validator: function(value){
						var ok = ["11", "1n", "n1", "nn"];
						if(Ext.Array.contains(ok, value)) {
							return true;
						} else {
							return 'Error! Value must be one of ' + ok;
						}
						return false;
					},
				}
			}, {
				xtype:'actioncolumn',
				width:30,
				items: [{
					icon: 'images/delete.png',
					tooltip: 'Delete',
					sortable: false,
					action: "attributeDelete",
					handler: function(grid, rowIndex, colIndex) {
						var rec = grid.getStore().getAt(rowIndex);
						grid = grid.up(); // Passed is not the grid we want
						grid.fireEvent("attributeDelete", grid, rec.get("field2"), Ext.getCmp("objectEdit").objectId);
					}
				}]
			},
		],
		plugins: [
			Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 2
			})
		],
		viewConfig: {
			plugins: {
				ptype: 'gridviewdragdrop',
				dragText: 'Drag and drop to reorganize'
			},
			listeners: {
				drop: function (node, data, dropRecord, dropPosition) {
					var dragRecord = data.records[0];
					var new_sort = [];
					var dragID = dragRecord.get("field2");
					var dropID = dropRecord.get("field2");

					Ext.each(Ext.getCmp("objectDragGridRelations").sorting, function(item) {
						if (item == dragID)
							return true;

						if ((item == dropID) && (dropPosition == "before"))
							new_sort.push(dragID);

						new_sort.push(item);

						if ((item == dropID) && (dropPosition == "after")) 
							new_sort.push(dragID);

					});
					Ext.getCmp("objectDragGridRelations").sorting = new_sort;
				}
			}
		},
	}, {
		xtype: 'form',
		title: 'Extra',
		id: "objectExtras",
		layout: "fit",
		items: [{
	        xtype: 'tooltiptextfield',
	        maxHeight: 20,
	        padding: 5,
	        toolTipText: "Place JavaScript Code here. Use $Attribute_Name as identifier",
	        fieldLabel: 'Displayed Name',
			labelWidth: 100,
	        name: 'displayname',
		}],
	}],

	reset: function() {
		this.down("xcombo").reset();
		this.resetGrid(this.items.getAt(0));
		this.resetGrid(this.items.getAt(1));
		this.items.getAt(2).items.each(function(item) { item.reset(); } );
	},

	loadObject: function(record) {
		this.objectId = record.get("id");
		this.doLoadObject(record, "attributes", this.items.getAt(0));
		this.doLoadObject(record, "relations", this.items.getAt(1));
		this.items.getAt(2).loadRecord(record);
		return;
	},

	resetGrid: function(grid) {
		var attribs = new Ext.data.ArrayStore({
			data: [["Please select an Object", "1"]],
			fields: ['field1','field2'],
			sortInfo: {
				field: 'displayValue',
				direction: 'ASC'
			}
		});
		grid.bindStore(attribs);
	},

	doLoadObject: function(record,type,grid) {

		var items = record.get(type).split(" ");
		grid.sorting = [];
		var tmp = [];

		var aStore = Ext.getStore("Attribute");
		var rStore = Ext.getStore("Relation");
		Ext.each(items, function(item) {
			if (item == "")
				return true;
			var s = item.split('.');
			
			var name = "";
			var record = ((s[0] == "Attribute") ? aStore : rStore).findExactRecord( "id", s[1] );
			if (s[0] == "Attribute") {
				name = record.get("name");
				var attributType= record.get("type");
	          	switch(attributType) {
	          		case "xdatetime":attributType = "Date/Time";break;
	          		case "wdate":attributType = "Date";break;
	          		//case "wtime":attributType = "Time";break;
	          		case "checkbox":attributType =  "TRUE/FALSE";break;
	          		case "wlist":attributType = "List";break;
	          		case "wrlist":attributType = "Drop Down List";break;
	          		case "textfield":attributType = "Freitext";break;
	          		case "htmleditor":attributType = "Richtext";break;
	          		case "numberfield":attributType = "Number";break;
	          		case "":break;
	          		default: return "";
	          	}
				tmp.push([name, item,'', attributType]);
			} else {
				name = (s[0] == "Relation" ? record.get("name_ab") : record.get("name_ba"));
				var cardinality = record.get("cardinality");
				tmp.push([name, item, cardinality]);
			}
			grid.sorting.push(item);
		}); 

		var tmpStore = Ext.create('Ext.data.ArrayStore', { fields: [ 'field1', 'field2', 'field3', 'field4']});
		tmpStore.loadData(tmp);
		grid.bindStore(tmpStore);
	},

	buttons: [{ // Fires into the Attribute controller
		text: "Save",
		action: "objectSaveClass",
		formBind: true,
	}, {
		text: "Delete selected Object",
		action: "objectDeleteClass",
		formBind: true,
	}],
});
