Ext.define('Rob.view.Viewport', {
    extend: 'Ext.container.Viewport',

    layout: 'border',

	requires: [
		'Rob.view.StarfieldSimulation',
		'Rob.view.RobListEditor',
		'Rob.view.AttributeForm',
		'Rob.view.RelationForm',
		'Rob.view.LoadableGrid',
		'Rob.view.InstanceInfo',
		'Rob.view.TextField',
		'Rob.view.ObjectInfo',
		'Rob.view.ObjectEdit',
		'Rob.view.Welcome',
		'Rob.view.Menu',
		'Rob.view.Tree',

		'Ext.ux.form.field.DateTime',
		'Ext.ux.tree.FilteringView',
		'Ext.ux.tree.TreeTextFilter',
		'Ext.ux.ClearableCombo',

		// widgets
		// for relations
		'Rob.widget.1to1',
		'Rob.widget.1toN',

		// for incomming relations 
		'Rob.widget.from1',
		'Rob.widget.fromN',

		// for attributes
		'Rob.widget.RobList',
		'Rob.widget.List',
		'Rob.widget.Time',
		'Rob.widget.Date',

		'Rob.widget.NameColumn',
	],

	items: [{
		region: "north",
		xtype: 'panel',
		html: '<div id="lala" style="background-color: #ddd"> <table> <tr> <td width="8"></td> <td> <a href="./"><img border="0" src="images/BPMspacecustomLogo.jpg" width="570" height="51"> </a></td> </tr> </table> </div>',
	}, {
		region: "center",
		padding: 10,
		xtype: 'container',
		layout: {
			type: 'hbox',
			align: 'stretch'
		},
		items: [{ 
		    xtype: 'tree',
		 }, {
		    xtype: 'container',
		    id: 'nav-content',
		    flex: 1,
		    layout: 'card',
		    items: [{
		        xtype: 'welcome',
		    }, {
		        xtype: 'starfield',
		        id: 'graph',
		    }, {
		        xtype: 'objedit',
		    }, {
		        xtype: 'instinfo',
		    }]
		}],
	}]
});
