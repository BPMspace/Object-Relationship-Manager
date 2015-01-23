Ext.define('Rob.widget.HrefColumn', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.hrefcolumn'],

    defaultRenderer: function(value){
		return Ext.String.format('<button type="button" class="extLink">{0}</button>', value);
    }
});
