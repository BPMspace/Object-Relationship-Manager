Ext.define('Rob.controller.Record', {
	extend: 'Ext.app.Controller',

	init: function() {
		this.control({
			'[action=objectDeleteRecord]': {
				click: this.onRecordDelete,
			},
			'[id=objectInfo]': {
				removeInstanceIconClick: this.onRecordDeleteById,
			},
			'[action=objectStoreRecord]': {
				click: this.onRecordStore,
			},
		});
	},

	onRecordStore: function(view, event, type) {
		var view = view.up("object");
		var store = view.id;
		var form = view.getForm();
		var record = form.getRecord(); 

		record = this.storeRecord(form, Ext.getStore(store));
		if (record) {
			view.commit(); // This is really important, as it stores changes to Relations
			Ext.getStore(store).sync();
			view.loadRecord(record);
		}
	},

	onRecordDeleteById: function(view, id, type, fn) {
		this.deleteRecord(id, type);
		if (fn) fn();
	},

	deleteRecord: function(id, type) {
		var record = Ext.getStore(type).findExactRecord("id", id);
		Ext.getStore(type).remove(record);
		Ext.getStore(type).sync();
	},

	onRecordDelete: function(view, event, type) {
		var form = view.up("object");
		var id = form.getCurrentObjectId();
		var kind = form.objectKind;

		this.deleteRecord(id, kind);

		form.loadRecord(Ext.create("Rob.model." + kind));
		form.getForm().reset();
	},

	storeRecord: function(form, store) {
		var record = form.getRecord();

		if (!record) {
			throw("Hit a bug. Form has no attached record;");
			record = Ext.create("Rob.model." + store.storeId);
		}

		if (!form.isValid()) { // make sure the form contains valid data before submitting
			Ext.Msg.alert('Invalid Data', 'Please correct form errors.')
			return;
		}

		if (Ext.isEmpty(record.get("name"))) //Someone saved a "New Item"
			store.add(record);

		form.updateRecord(); // update the record with the form data

		if (record.isValid()) { 
			store.sync();
			return record;
		} else { 
			Ext.Msg.alert('Invalid Data', 'Please correct form errors.')
		} 
		return null;
	},

});

