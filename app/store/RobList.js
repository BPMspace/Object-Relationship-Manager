Ext.define('Rob.store.RobList', {
    extend: 'Ext.data.Store',
    model: 'Rob.model.RobList',
    requires: 'Rob.model.RobList',
	autoSync: true,
	autoLoad: true,
});
