Ext.define('Rob.widget.1toN', {
    extend: 'Ext.grid.Panel',
	alias: ['widget.1n', 'widget.nn'],
	collapsible: true,
	titleCollapsible: false,
	ovalue: "",
	margin: 10,
	layout:'fit',
    mixins:{
        field:'Ext.form.field.Field',
        relation:'Rob.mixins.Relation',
        formation: 'Rob.mixins.Format',
        tooltip: 'Rob.mixins.Tooltip'
    },
	columns: [
		{ header: 'Name',  dataIndex: 'name', forceFit:true, flex:1,
		// renderer renders Tooltip and linkifies the Instance Object

		renderer: function(value, meta,record){ 
		
			var objectRecord= Ext.getStore("Object").findExactRecord("id", this.objectRecordId);
			var tooltip = this.checkTooltip(null,record, "instance");
		
		//meta.tdAttr= 'data-qtip="<h5>'+record.get('name')+'</h5><br> Attributes: </br>'+attribarray.join(' ')+'</br></br> Relations: </br>'+relationarray.join(' ')+'"';
		meta.tdAttr= 'data-qtip="' + tooltip+ '"';
		//return Ext.String.format('<a href="#/root/{0}/{1}">{2}</a>', objectRecord.get("sName"),record.data.id, value   );
		var link_array =[objectRecord.get("sName"),record.data.id, value];
		return this.formatLink(link_array, "instance");
		
		}
		},
	],

	
	height: 205,
	frame: false,
	iconCls: 'icon-grid',

	listeners: {
		// ALL calls are needed, otherwise data 
		// does not show up correctly
		beforerender: Ext.Function.createDelayed(function() {
				this.setVisible(false);
		}, 10),
		afterrender: Ext.Function.createDelayed(function() {
			this.setValue(this.ovalue);
			this.resetOriginalValue();
			this.updateGridTitle(); 
			this.collapse();
			this.setVisible(true);
		}, 80),
		beforeselect: function(chckbx, record, index, opts) {
			return this.gridBeforeSelect(chckbx, record, index, opts);
		},
		selectionchange: Ext.Function.createBuffered(function() {
			this.updateGridTitle();
		}, 50),

	},

	initComponent: function() {
		this.selModel = Ext.create('Ext.selection.CheckboxModel', { checkOnly: true,width:40} );
		this.callParent();
	},

	getValue: function() {
		var f = this.readGrid("id");
		Rob.ReferenceManager.updateOutRefs(this.ovalue.split(" "), this.store, f, this.objectRecordId, this.relationid, this.cardinality);
		return f.join(" ");
	},

	setValue: function(value) {
		var smu = this.getSelectionModel();
		smu.deselectAll();

		// bugfix for 4.1.1a
		this.ovalue = value;
		if (!value) return;

		var k = keys2storeIdx(this.store, value.split(" "))
		for (i in k)
			smu.select(k[i], true);
	},
});
