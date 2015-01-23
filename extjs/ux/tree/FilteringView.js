/**
 * @class Ext.ux.tree.FilteringView
 * @extends Ext.tree.View
 * Enhances the basic tree.View with filtering capabilities. Any component that implements the functions
 * 'filterFn' and 'reset' can be used with this view. However, it is recommended to use the 
 * enhanced form fields also defined in this extension.
 *
 * modified from: http://www.sencha.com/forum/showthread.php?245120-Tree-filtering
 */
Ext.define('Ext.ux.tree.FilteringView',{
	extend:'Ext.tree.View',
	alias:'widget.treefilteringview',

	/** configs **/
	useDataIds:false,//Use node.data.id when hashing to use your own unique ids.
	maxExpandDepth:3,//Max depth to perform expansion of visible nodes.
	hideEmptyFolders:false,//hide empty folders, durrrrr

	/** local vars **/
	filterRegister: new Ext.util.HashMap(),
	filterNodeHash: [],
	filtered:false,
	doNotFilter:false,

	expand:function(node){
		this.callParent(arguments);
		if(this.isFiltered()){ this.applyFilters(node,0); }
	},
	refresh:function(){
		this.callParent(arguments);
		if(this.isFiltered()){ this.applyFilters(null,0); }
	},
	registerFilter: function(filterCmp){
		if(!this.filterRegister.containsKey(filterCmp.id)){
			this.filterRegister.add(filterCmp.id, filterCmp);
		}
	},

	/**
	 * Adds nodes to the filterNodeHash indicating whether they should be shown
	 * or hidden. Nodes are added/removed based on the return value of the supplied
	 * filterCmp.filterFn function (true = show, false = hide).
	 */
	applyFilterFn: function(filterCmp) {
		var me = this;
		var root = this.getTreeStore().getRootNode();
		me.registerFilter(filterCmp);

		if(typeof filterCmp.beforeFilter === 'function'){
			filterCmp.beforeFilter();
		}

		this._applyFilterFn(filterCmp, root);

		if(typeof filterCmp.afterFilter === 'function'){
			filterCmp.afterFilter();
		}
		me.filtered = true;
		me.applyFilters(root,0);
	},
	/**
	 * This is called recursively
	 */
	_applyFilterFn: function(filterCmp, root) {
		var me = this;

		if(root.isRoot() && !me.rootVisible){ return; }//skip invisible root
		var nid = (me.useDataIds===true)? root.data.id:root.id;

		if(typeof me.filterNodeHash[nid]==='undefined'){
			me.filterNodeHash[nid] = [];
		}

		if (root.isLeaf()) {
			me.filterNodeHash[nid][filterCmp.id] = (filterCmp.filterFn.call(filterCmp,root) != 1);
			return me.filterNodeHash[nid][filterCmp.id];
		} 

		// Folders, first check folder name,
		// then recusively add the leafs
		var folderNameMatched = (filterCmp.filterFn.call(filterCmp,root) == 1);
		me.filterNodeHash[nid][filterCmp.id] = -folderNameMatched;
		root.eachChild(function(node){
			var cid = (me.useDataIds===true)? node.data.id:node.id;
			me.filterNodeHash[nid][filterCmp.id] &= me._applyFilterFn(filterCmp, node);
			// Overwrite matching (by setting to false)
			// because folder matched and hence show every leaf
			if (folderNameMatched) {
				me.filterNodeHash[cid][filterCmp.id] = false;
				me.filterNodeHash[nid][filterCmp.id] = -folderNameMatched;
			}
		}, me);

		return me.filterNodeHash[nid][filterCmp.id];

	},

	/**
	* Runs over nodes starting from 'node' recursively expanding and hidding nodes
	* that are marked hidden by at least one filter in the filterNodeHash.
	* Nodes that have no visible children are collapsed.
	*
	* @params
	*	   node	The node at which to begin filtering.
	*	   myDepth The depth of the current recursive call. Used to stop expansion
	*			   of nodes deeper than the value of maxExpandDepth.
	**/
	applyFilters: function(node){
			if(this.doNotFilter){ return; }

			var me = this;
			var hasVisibleChild=false;
			var node = (node===null || typeof node === 'undefined')? this.getTreeStore().getRootNode():node;
			var myDepth = node.getDepth();

			/** 
			* Don't filter when we expand the node internally or we 
			* will have several instances of filtering going on at the same time!
			**/
			me.doNotFilter=true;
			node.expand();//necessary to be sure Ext.fly will have access to a rendered element
			me.doNotFilter=false;
			node.eachChild(function(childNode){
				var el = Ext.fly(me.getNodeByRecord(childNode));
				el.setVisibilityMode(Ext.Element.DISPLAY);
				if(me.isNodeFiltered(childNode)){
					childNode.collapse(true);
					el.setVisible(false);
					childNode.visible = false;
					this.up().fireEvent("TreeStoreElementFiltered", !childNode.isLeaf(), childNode.get("id"));
				}else{
					hasVisibleChild=true;
					childNode.visible = true;
					this.up().fireEvent("TreeStoreElementNotFiltered", !childNode.isLeaf(), childNode.get("id"));
					el.setVisible(true);
					if((myDepth+1) < me.maxExpandDepth){
						me.applyFilters(childNode);
					}
				}
			}, this);

			if(!hasVisibleChild && me.isFiltered()){
				//node.collapse();
				if(me.hideEmptyFolders && !node.isRoot()){
					//Ext.fly(me.getNodeByRecord(node)).setVisible(false);
				}
			}
	},

	/**
	* Clears the specified filter.
	* @params:
	*	   filterCmp	   The component registered as a filter.
	*	   apply		   Set false if you don't want the changes applied immediately.
	*/
	clearFilter: function(filterCmp,apply){
		if(this.isFiltered()){
			if(typeof filterCmp.beforeClearFilter === 'function'){
				filterCmp.beforeClearFilter();
			}
			for(n in this.filterNodeHash){
				if(this.filterNodeHash[n][filterCmp.id]!=='undefined'){
					delete this.filterNodeHash[n][filterCmp.id];
				}
				if(this.arraySize(this.filterNodeHash[n]) <= 0){
					delete this.filterNodeHash[n];
				}
			}
			if(this.arraySize(this.filterNodeHash)<=0){
				this.filtered = false;
			}
			if(apply!==false){
				this.applyFilters(null);
			}
			if(typeof filterCmp.afterClearFilter === 'function'){
				filterCmp.afterClearFilter();
			}
		}
	},
	arraySize:function(obj){
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	},

	/**
	* Clears all filters.
	* @params:
	*	   apply		   Set false if you don't want the changes applied immediately.
	*/
	clearAllFilters : function(apply) {
		if (this.isFiltered()) {
			this.filterNodeHash = [];
			this.filtered = false;
			if(apply!==false){ this.applyFilters(null,0); }
		}
	},

	/**
	* Returns true if the tree is filtered
	*/
	isFiltered : function() {
		return this.filtered;
	},

	/**
	* Returns true if the specified node is filtered by any of the managed filters
	*/
	isNodeFiltered:function(node){
		var me = this;
		var nid = (me.useDataIds===true)? node.data.id:node.id;
		for(var f in me.filterNodeHash[nid]){
			if(me.filterNodeHash[nid][f] == 1){
				return true;
			}
		}
		return false;
	}
});
