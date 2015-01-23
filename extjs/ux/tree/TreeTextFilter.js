/**
 * @class Ext.ux.tree.TreeTextFilter
 * @extends Ext.form.Trigger
 * Provides a basic text entry field with a trigger for clearing the field/filter and another
 * to apply the field value and filter.
 *
 * modified from: http://www.sencha.com/forum/showthread.php?245120-Tree-filtering
 * Modified, because usually tree is not loaded when initComponent is called
**/
Ext.define('Ext.ux.tree.TreeTextFilter',{
	extend:'Ext.ux.ClearableCombo',
	alias:'widget.treetextfilter',
	tree: null,

	initComponent:function(){
		this.callParent(arguments);
		try{
			var t = this.tree;
			if(typeof this.tree === 'string') 
				t = Ext.getCmp(this.tree);

		} catch(e) { 
			console.log('Invalid tree provided to this treetextfilter'); 
			this.tree = t;
		}

		//Apply filter when user types the 'Enter' key
		this.on('specialkey', function(f, e){
			if(e.getKey() == e.ENTER){
				this.filter();
			}
		}, this);
	},

	trigger2Click: function(){
		if(typeof this.tree === 'string') 
			this.tree = Ext.getCmp(this.tree);
		var me = this;
		var v = this.getValue();
		this.collapse();
		if ((this.store.findExact('field1', v) == -1) && me.tree.getView().filtered) {
			me.store.add({'field1': v});
		}
		me.tree.getView().clearFilter(me);
		this.setValue('');
		this.blur();
		Ext.getCmp("nav-region").fireEvent("TreeStoreUnFiltered");
	},

	filter:function(){
		if(typeof this.tree === 'string') 
			this.tree = Ext.getCmp(this.tree);
		var me = this;
		this.value = this.getRawValue().trim();
		me.tree.getView().applyFilterFn(me);
		Ext.getCmp("nav-region").fireEvent("TreeStoreFiltered");
	},

	/* Override this function to implement custom filtering */
	filterFn:function(node){return true;}
});
