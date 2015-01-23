Ext.define('Rob.controller.ImportExport', {
	extend: 'Ext.app.Controller',

	init: function() {
		this.control({
			'[id=importButton]': {
				click: this.importData,
			},
			'[id=exportButton]': {
				click: this.exportData,
			},
		});
	},

	importData: function(view) {
		var form = view.up("window").items.first().getForm();
		if(form.isValid()){
			form.submit({
				url: 'bcknd/fn.php?fn=import',
				waitMsg: 'Uploading ...',
				success: function(fp, o) {
					Ext.Msg.alert('Success', "Data has been imported.", function() {
						window.location.reload();
					});
				}
			});
		}
	},

	exportData: function(view) {
		var form = view.up("window").items.last().getForm();
		window.open('bcknd/fn.php?fn=export&all=' + form.getFieldValues().exportData,'download');
	},

});
