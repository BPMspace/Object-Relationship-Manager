// Dashes should not be contained in variable names
// they work, but the debugger does not like them
Ext.define('Rob.util.CustomIdGenerator', {
	extend: 'Ext.data.IdGenerator',
	alias: 'idgen.rob',

	generate: function () {
		return Ext.data.IdGenerator.get('uuid').generate().replace(/-/g, "");
	}
});
