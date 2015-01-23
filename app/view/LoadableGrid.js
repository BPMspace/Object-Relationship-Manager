Ext.define('Rob.view.LoadableGrid', {
    extend: 'Ext.grid.Panel',
	alias: 'widget.loadablegrid',
	hidekey: "undefined",
	collapsible: true,
	collapsed: false,
    mixins:{    
        field:'Ext.form.field.Field'
    },

	listeners: {
		beforerender: function() {
			console.log("renders");
			if (this.hidekey != "undefined") {
				var filter = this.hidekey;
				this.store.filter( [{ filterFn: function(record) { return (filter.indexOf(record.data.id) == -1) }} ] );
			}
			/*
			* v=this.getView()
			* r=v.getNodeByRecord(1);
			* r=v.getNode(1);
			* r.style.display="none";
			*/
		},
		destroy: function() {
			//console.log("destroy");
			this.store.clearFilter(true);
		},
	},

	//hideHeaders: true,
	//height: 300,
	frame: false,
	iconCls: 'icon-grid',

	getValue: function() {
		//console.log("Get Value");
		var smu = this.getSelectionModel();

		var sel = smu.getSelection();
		var f = [];
		for (var r in sel) {
				f.push(sel[r].data.id);
		}
		return f.join(" ");
	},
	setValue: function(value) {

		var smu = this.getSelectionModel();

		smu.deselectAll();

		if (!value) return;
		var k = keys2storeIdx(this.store, value.split(" "));
		for (var i in k) {
			if (k[i] > -1) smu.select(k[i], true);
		}

		//console.log("Set to " + this.getValue());
	},

});
