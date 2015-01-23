Ext.define('Rob.widget.fromN', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.fromn',
	collapsible: true,
	titleCollapsible: false,
	// collapsed:true, // this causes too manny problems. we hide
						// the object before the user complains ;)
	margin: 10,
	layout:'fit',
	inref: [], // The value as loaded
	 mixins:{
        field:'Ext.form.field.Field',
        relation:'Rob.mixins.Relation',
        formation: 'Rob.mixins.Format',
        tooltip: 'Rob.mixins.Tooltip'
    },
	columns: [
		{ header: 'Name',   dataIndex: 'name', forceFit:true, flex:1, name:'name', 
		
		// renderer renders Tooltip and linkifies the Instance Object
		renderer: function(value, meta,record){ 
		
			var objectRecord= Ext.getStore("Object").findExactRecord("id", this.objectRecordId);
			var tooltip = this.checkTooltip(null,record, "instance");

		//meta.tdAttr= 'data-qtip="<h5>'+record.get('name')+'</h5><br> Attributes: </br>'+attribarray.join(' ')+'</br></br> Relations: </br>'+relationarray.join(' ')+'"';
		meta.tdAttr= 'data-qtip="' + tooltip+ '"';
		//console.log(tooltip);
		//return Ext.String.format('<a href="#/root/{0}/{1}">{2}</a>', objectRecord.get("sName"),record.data.id, value   );
		var link_array =[objectRecord.get("sName"),record.data.id, value];
		return this.formatLink(link_array, "instance");
		}
		}
		
	],

	height: 205,
	frame: false,
	iconCls: 'icon-grid',

	tip:{
		title : 'Hello',
		itemId : 'itemId',
		target : this.el,
		delegate : 'x-grid-cell', // the cell class in which the tooltip has to be triggered
		trackMouse : true,
		renderTo : Ext.getBody()
	},
	
	initComponent: function() {
		this.selModel = Ext.create('Ext.selection.CheckboxModel', { checkOnly: true,width:40, name:'checkbox' } );
		this.callParent();
	},

	listeners: {
		reconfigure: function() {
		},
		beforestaterestore: function() {
		},
		beforeselect: function(chckbx, record, index, opts) {
			return this.gridBeforeSelect(chckbx, record, index, opts);
		},
		// ALL calls are needed, otherwise data 
		// does not show up correctly
		beforerender: Ext.Function.createDelayed(function() {
				this.setVisible(false);
		}, 10),
		afterrender: Ext.Function.createDelayed(function() {
				this.load();
				this.updateGridTitle(); 
				this.collapse();
				this.setVisible(true);
		}, 20),
		destroy: function() {
		},
		selectionchange: Ext.Function.createBuffered(function() {
			this.updateGridTitle();
		}, 50),
	},

	// An incomming reference does not have a value,
	// it is determined by incomming pointers @see load
	getValue: function() {
		return "";
	},

	reset: function() {
		var smu = this.getSelectionModel();
		smu.deselectAll();
		this.inref = [];
	},

	load: function() {
		var smu = this.getSelectionModel();
		this.reset();
		var k = Rob.ReferenceManager.getInRefs(this.relationid, this.getObjectId());
		console.log("Loading " + this.fieldLabel);

		for (var i in k) {
			smu.select(k[i], true);
			this.inref.push(k[i].get("id"));
		}
	},

	commit: function() {
		var v = this.readGrid("id");
		this.inref.sort();

		if (this.inref.join(" ") != v.join(" "))
			Rob.ReferenceManager.updateInrefs(this.relationid, this.getObjectId(), this.inref, v);
	},

	isDirty: function() {
		var v = this.readGrid("id");
		this.inref.sort();

		return this.inref.join(" ") != v.join(" ");
	},

});
