Ext.define('Rob.view.TextField', {
	extend: 'Ext.form.field.Text',
	alias: 'widget.tooltiptextfield',
	listeners : {
		render: function(p) {
			if (Ext.isEmpty(p.toolTipText))
				return;
			var theElem = p.getEl();
			var theTip = Ext.create('Ext.tip.Tip', {
				html: p.toolTipText,
				margin: '30 10 0 100',
				shadow: false
			});
			p.getEl().on({ 
				'mouseover': { fn: function(){ theTip.showAt(theElem.getX(), theElem.getY()); } },
				'mouseleave': { fn: function(){ theTip.hide(); } } 
			});
		}
	}
});
