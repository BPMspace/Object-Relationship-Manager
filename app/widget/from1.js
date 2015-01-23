Ext.define('Rob.widget.from1', {
	extend: 'Ext.ux.ClearableCombo',
	alias: 'widget.from1',
	frame: false,
	trackResetOnLoad: true,
	oldvalue: "",
	passthrough: false,

	displayField: "name",
	valueField: "id",

	mixins: {
		'relation': 'Rob.mixins.Relation',
	},

	listeners: {

		beforeselect: function(combo, record, index, opts) {
			return this.comboBeforeSelect(combo, record, index, opts);
		},
	},

	// Ignore the passed value.
	// This is an INref, load data from 
	// the orginating relation
	load: function() {
		try {
			var objectid = this.getObjectId();
			var k = Rob.ReferenceManager.getInRefs(this.relationid, objectid);

			// isDirty works because of this
			if (k.length > 0) {
				this.oldvalue = k[0].get("id");
			} else {
				this.oldvalue = "";
			}
		} catch (e) {
			console.log(e);
		}
		this.setValue(this.oldvalue);
		this.originalValue = this.oldvalue;
		//console.log(Ext.getStore(this.getObject()).findExactRecord("id", oldvalue));
	},

	commit: function() {
		var objectid = this.getObjectId();
		if (this.oldvalue != this.value)
			Rob.ReferenceManager.updateInrefs(this.relationid, objectid, [this.oldvalue], [this.value]);
		else 
			console.log("Relation " + this.relationid + " unchanged");
	},

	trigger2Click: function() {
		this.setValue("");
	},

});
