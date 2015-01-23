Ext.define('Rob.widget.Time', {
	extend: 'Ext.form.field.Time',
	alias: 'widget.wtime',
	frame: false,
	getValue: function() {
		return this.getRawValue();
	},
});
