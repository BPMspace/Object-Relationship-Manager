Ext.define('Rob.view.InstanceInfo', {
	extend: 'Ext.form.Panel',
	
	alias: 'widget.instinfo',
	id: "instinfo",
	object: undefined,
	//layout:'fit',
	instinfo:this,
	title:'', 
	mixins: {
		filter: 'Ext.ux.grid.FiltersFeature',
		formation: 'Rob.mixins.Format',
		tooltip: 'Rob.mixins.Tooltip'
	},
	defaults: {
		border: false,
	},
	listeners: {
		beforeshow: function() {
			this.switchToCurrentNavItem();
		},
		afterload: function() {
			this.switchToCurrentNavItem();
		},
		load: function() {
			this.switchToCurrentNavItem();

		}
	},
	
	items:[{xtype:'displayfield',
			value:'',
			id:'objectTitle',
			fieldLabel:'Object ',
			padding: '10',
			labelWidth: 100
			},
		{
		xtype:'grid',
		layout:'fit',
		name: 'grid',
		sorting: [],
		// Filters 
		features: [{
                ftype: 'filters',
                encode: false,
                local: true,
            }],
	columns: [
			{header: 'ID', dataIndex: 'id', flex:true,sortable: true,sortable: true, filter: {
                type: 'string',
                disabled: false,
               
            }}, 
			{header: 'Name', dataIndex: 'name', flex: true, sortable: true, filter: {
                type: 'string',
                disabled: false,
                 dataIndex:'name'
               
            },
			renderer: function(value, meta,record){ 
				return Ext.String.format('<a href="#/root/{0}/{1}">{2}</a>', object.get("sName"),record.data.id, value);
			}}, 
			{header: 'Attribute Name: Attribute Value', dataIndex: 'attributes', flex: true, sortable: false, 
			filter: {
                type: 'string',
                disabled: false,
                
            }}, 
			
			{header: 'Relation Name: Relation Value: Related Object: Cardinality', dataIndex: 'relations', flex: true, sortable: false,
			filter: {
                type: 'string',
                disabled: false,
                
            },           
            }
			 ],
	}],
	initComponent: function() {
		this.callParent();
	
	},
	loadObjects: function(record,item) {
		var attribs= Ext.create('Ext.data.ArrayStore', { fields: [ 'id', 'name', 'attributes', 'relations'] , sortInfo: {
				field: 'displayValue',
				direction: 'ASC'
			}});
		var tmp = [];
		Ext.getStore(record.get("sName")).each(function(objectInstance) 
			{
					if (!objectInstance) return;
					var counter = 1;
					var attrib_array = Rob.ReferenceManager.getInstanceAttributeNamesAndValues(null, objectInstance);
					var relation_array = Rob.ReferenceManager.getInstanceRelationNameAndValues(null, objectInstance);
					//Have to get same array AGAIN, because the default array is already formatted
					var copy_attr_array =Rob.ReferenceManager.getInstanceAttributeNamesAndValues(null, objectInstance);
					var copy_rel_array = Rob.ReferenceManager.getInstanceRelationNameAndValues(null, objectInstance);
					
					//why the *** are both arrays already formatted BEFORE the format function is called?
					//why are they formatted if both arrays serve as parameter?
					
					//formatting functions
					var formatted_attrib_array= this.up().format(attrib_array, "attribute");
					attrib_array = this.up().isNull(attrib_array, " Attributes");
					var formatted_relation_array = this.up().format(relation_array,"relation");
					
					// For every entry in relation array, get a tooltip
					for (var i=0;i<  relation_array.length; i++)
					{
					
					var tooltip = this.up().checkTooltip(null,copy_rel_array[i][1][0], "instance");
					var tooltip2 = this.up().checkTooltip(copy_rel_array[i][2],null, "object");

					//Tooltip not working because relation_array is formatted (?) and tooltip has problems with format (relation)
					//Why does the format Method format the relation_array and does not simply take it as a parameter??!!
					if (tooltip != undefined && tooltip2 != undefined)
					{
						relation_array[i]="<span data-qtip='"+tooltip+"'>"+relation_array[i][0]+"</span>" +"<span data-qtip='"+tooltip2+"'>"+relation_array[i][1]+ "</span>";
					}
					else if (tooltip != undefined && tooltip2 == undefined) relation_array[i]="<span data-qtip='"+tooltip+"'>"+relation_array[i][0]+"</span>" +relation_array[i][1];
					else if (tooltip == undefined && tooltip2 != undefined) relation_array[i]=relation_array[i][0] +"<span data-qtip='"+tooltip2+"'>"+relation_array[i][1]+ "</span>";
					else relation_array[i]=relation_array[i][0]+relation_array[i][1];

					}
					
				relation_array = this.up().isNull(relation_array, " Relations");
				
				tmp.push([objectInstance.get("id"), objectInstance.get("name"), attrib_array.join(' '), relation_array.join(' ')]);
				item.sorting.push(objectInstance);
			},item);
		attribs.loadData(tmp);
		item.bindStore(attribs);
	},
	switchToCurrentNavItem: function() {
		var task = new Ext.util.DelayedTask(function(){
		var node = Ext.getCmp("nav-region").getSelectionModel().getSelection()[0];
		if (!node) 
			return;
		console.log(node);
		if (node.isLeaf()) 
			node=node.parentNode;

		if (node == null)
			return;

		if (node.getPath() == "/root")
			return;

		var record = Ext.getStore("Object").getAt(
			Ext.getStore("Object").findExact("sName", node.get("id"))
		);

		var id = record.get("id");
		this.loadObjects(record, this.items.last());
		object = record;
		Ext.getCmp('objectTitle').setValue(object.get("name"));		
			}, this);
			task.delay(50);
	},

});
