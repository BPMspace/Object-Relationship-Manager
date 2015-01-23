/**
 * An implementation of a proxy, that reads data from our various stores
 * and feeds that back into the a Store.
 *
 * Currently lacks updating of newer nodes, hook up to the AppEvents framework
 * to finish the implementation.
 */
Ext.define('Rob.proxy.InstancesReader', {
	alias: 'proxy.instancesreader',
    extend: 'Ext.data.proxy.Memory',

	getNodeDisplayName: function(object, record) {
		if (object.get("displayname") == "")
			return record.get("name");
		return object.formatField('displayname', record);
	},

	read: function(operation, callback, scope) {
		
		var res = [];
		Ext.getStore("Object").each(function(object) {
			var store = Ext.getStore(object.get("sName"));
			if (!store)
				return;
			store.each(function(item) {
				data = ({
					name: this.getNodeDisplayName(object, item),
					id: item.get('id'),
					store: store.storeId,
				});
				res.push(this.model.create(data, data.id, data));
			}, this);
		}, this);

		operation.resultSet = Ext.create('Ext.data.ResultSet', {
			records: res,
			total  : res.length,
			loaded : true
		});

		operation.setCompleted();
		operation.setSuccessful();
		Ext.callback(callback, scope || this, [operation]);
	},
});

Ext.define("Rob.store.Instances", {
	extend: "Ext.data.Store",
	storeId: "Instances",
	model: "Rob.model.Object",
	proxy: { type: 'instancesreader' }
});
