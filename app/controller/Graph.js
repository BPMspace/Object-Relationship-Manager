// This contols both the 
// StarfieldSimulation and the ObjectInfo 
// views.
Ext.define('Rob.controller.Graph', {
	extend: 'Ext.app.Controller',

	stores: ['Object', 'Relation'],
	refs: [{
		ref: 'graph',
		selector: '[id=graph]'
	}, {
		ref: 'infovis`',
		selector: '[id=infovis]'
	}, {
		ref: 'viewType',
		selector: '[id=tbInstanceView]'
	}, {
		ref: 'info',
		selector: '[id=objectInfo]'
	}],

	init: function() {
		this.control({
			'[id=nav-region]': { // Die Events gibts nicht mehr ;/
				TreeStoreFiltered: this.onTreeFiltered,
				TreeFilterCleared: this.onTreeFiltered,
			},
			'[id=infovis]': {
				sliderChange: this.onSliderChange,
			},
			'[id=objectInfo]': {
			},
			'[id=graph]': {
				activate: this.onGraphShown,
				show: this.refreshObjInfo,
			},
			'[id=tbInstanceView]': {
				toggle: this.onToggleInstanceView,
			},
		});
		//this.getObjectStore().on('write',this.objectStoreWritten, this);
		//this.getRelationStore().on('write',this.relationStoreWritten, this);

		// Application Events
		//this.application.on("EdgeInstanceChanged", this.genEdgeChanged, this);
	},

	onGraphShown: function(view) {
		if (!view.fgraph) {
			this.getGraph().loadGraph();
			return;
		}
		if (this.checkGraphCenter() == false) // center did not change	
			view.bounceGraph();
	},

	checkGraphCenter: function() {
		var g = this.getGraph();
		var co = Rob.currentObject();
		if (g.fgraph.root == co.id)
			return false;
		this.refreshGraph(!co.isObject);	
		return true;
	},

	refreshObjInfo: function() {
		var view = this.getInfo();
		view.items.getAt(1).on({"activate": { fn: function() {
			view.loadObjects();
		}, single: true} });
		view.items.getAt(3).on({"activate": { fn: function() {
			view.loadEdgeInstances();
		}, single: true} });
	},

	onSliderChange: function(slider, value) {
		var g = this.getGraph();

		g.maxDepth = value;
		g.fgraph.graph.eachNode(function(node) {
			if (value == slider.maxValue)
				node.setData("alpha",1,"end");
			else if (node._depth < 0)
				node.setData("alpha",0,"end");
			else if (node._depth <= value)
				node.setData("alpha",1,"end");
			else
				node.setData("alpha",0,"end");
		});

		g.fgraph.animate({
			   modes: ['node-property:alpha'],
			   duration: 100
		});
	},

	relationStoreWritten: function(store, operation, ops) {
		this.getGraph().loadGraph();
	},
	
	onToggleInstanceView: function(button, active) {
		this.refreshGraph(active);
		button.toggle(active, true);
	},

	refreshGraph: function(active) {
		var g = this.getGraph();
		var data = undefined;
		var root = undefined;
		var record = undefined;
		var co = Rob.currentObject();
		if (active) {
			data = g.computeInstanceData();
			if (co.isObject) {
				if (co.store && (record = Ext.getStore(co.store).first()))
					root = record.get("id");
				else
					root = data[0].id;
			}
		} else {
			data = g.computeGraphData();
			if (!co.isObject) {
				if (co.store && (record = Ext.getStore("Object").findExactRecord("sName", co.store)))
					root = record.get("id");
				else
					root = data[0].id;
			}
		}
		console.log("Set root! " + root);
		g.loadData(data, root);
		//g.fgraph.refresh();
		this.getGraph().bounceGraph();
	},

	onTreeFiltered: function(view, isObject, id) {
		return;
		if (this.getViewType().pressed==false) return;
		var g = this.getGraph();
		var data = g.computeInstanceData();
		g.loadData(data);
		g.fgraph.refresh();
	},
});

