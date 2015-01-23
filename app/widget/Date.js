Ext.define('Rob.widget.Date', {
	extend: 'Ext.form.field.Date',
	alias: 'widget.wdate',
	frame: false,
	getValue: function() {
		return this.getRawValue();
	},
});
