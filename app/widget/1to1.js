Ext.define('Rob.widget.1to1', {
	extend: 'Ext.ux.ClearableCombo',
	alias: ['widget.11', 'widget.n1'],
	frame: false,
	trackRestOnLoad: true,

	displayField: "name",
	valueField: "id",

	mixins: {
		'relations': 'Rob.mixins.Relation',
	},

	listeners: {
		beforeselect: function(combo, record, index, opts) {
			return this.comboBeforeSelect(combo, record, index, opts);
		},
	},

	load: function() {
		console.log("loading");
		this.oldvalue = this.value;
	},

	commit: function() {
		var objectid = this.getObjectId();
		console.log("-------------------- Relation " + this.relationid + " obj: " + objectid);
		if (this.oldvalue != this.value)
			Rob.ReferenceManager.updateOutRefs([this.oldvalue], this.store, [this.value], objectid, this.relationid, this.cardinality);
		else
			console.log("Relation " + this.relationid + " unchangedi " + this.oldvalue);
	},

	trigger2Click: function() {
		this.setValue("");
	},

});
