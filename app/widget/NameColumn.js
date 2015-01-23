Ext.define('Rob.widget.NameColumn', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.namecolumn'],

    defaultRenderer: function(value){
		var record = Ext.getStore("Object").findExactRecord("id", value);
		if (!record)
			return value;
		return record.get("name");
    }
});
