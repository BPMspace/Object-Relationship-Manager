Ext.define('Rob.view.StarfieldSimulation', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.starfield',
	maxDepth: 2,
	mixins: {
		starfield: 'Rob.mixins.StarfieldSimulation',
	},
	id:'starfieldVis',
	layout: {
		type: 'vbox',
		align : 'stretch',
		pack  : 'start',
	},
	listeners: {
		resize: function(view, width, height) {
			if (this.fgraph)
				this.fgraph.canvas.resize(width, height);
		},
		boxready: function(view) {
			this.graphSetup(this.down("#infovis"));
		},
	},
	items: [{
		xtype: 'panel',
		bodyStyle: 'background-color: #1A1A1A;',
		id: 'infovis',
		flex: 1,
		minWidth:300,
		minHeight:300,
	}, {
		xtype: 'objinfo',
		height: 150,
	}],

	bounceGraph: function() {
		var me = this;
		this.fgraph.computeIncremental({
			iter: 1,
			property: 'end',
			onComplete: function(){
				me.fgraph.animate({
					modes:['polar'],
					transition: $jit.Trans.Elastic.easeOut,
					duration: 1500
				});
			}
		});
	},

	graphSetup: function(view) {

		var menuwidget = Ext.create("Ext.form.Panel", {
			renderTo: view.getEl(),
			ownerCt: view,
			bodyStyle: 'background-color: transparent; border-color: transparent;',
			floating: true,
			layout: {
				type: 'hbox',
				align: 'stretch',
				defaultMargins: { left: 10 },
			},
			forceLayout: true,
			padding: 10,
			header: false,
			items: [{
				xtype: 'button',
				text: 'Instance View',
				id: 'tbInstanceView',
				enableToggle: true,
			}, {
				xtype: 'slider',
				id: 'tbSlider',
				width: 200,
				value: 2,
				minValue: 0,
				maxValue: 10,
				listeners: {
					change: function(view, value) { this.up("#infovis").fireEvent("sliderChange", view, value); },
				}
			}],
		});
		menuwidget.doAutoRender();
		menuwidget.getEl().anchorTo(view.getEl(), "tr-tr")
		menuwidget.hide();
		menuwidget.shown = false;

		view.getEl().on("mouseenter", function() {
			if (menuwidget.shown) return;

			menuwidget.getEl().slideIn("t");
			menuwidget.shown = true;
			var task = new Ext.util.DelayedTask(function() {
				menuwidget.getEl().slideOut("t");
				menuwidget.shown = false;
			}, this);
			task.delay(4000);
			menuwidget.getEl().on("mouseenter", function() { task.cancel() });
			menuwidget.getEl().on("mouseleave", function() { task.cancel(); task.delay(2000) });
		});
	},
	loadData: function(data, root) {

		var co = Rob.currentObject();

		if (Ext.isEmpty(root))
			root = co.id;

		if (Ext.isEmpty(data))
			data = (co.isObject ? this.computeGraphData() : this.computeInstanceData());

		if (Ext.isEmpty(root))
			root = data[0].id;

		this.fgraph.loadJSON(data);
		if (this.fgraph.graph.hasNode(root))
			this.fgraph.root = root;
		else
			debugger; // this is not good :/
		this.fgraph.graph.computeLevels(root, 0);

		var graph = this.fgraph.graph;

		var max = 2;
		graph.maxDepth = 0;
		graph.eachNode(function(node) {
			if (node._depth > graph.maxDepth) graph.maxDepth = node._depth;
			if (node._depth == -1) node._depth=10;
			node.setData("alpha",0,"end");
		});

		try {
			var slider = Ext.getCmp('tbSlider');
			max=slider.getValue();
			slider.setMaxValue(graph.maxDepth + 1);

			var toggle = Ext.getCmp('tbInstanceView');
			toggle.toggle(co.isObject == false, true);
		} catch (e) {
			console.log(e);
			// TODO ausserdem wird die root nicht geandert wenn man von einem Ordner auf eine instance wechselt :/
		}

		graph.eachNode(function(node) {
			if ((node._depth <= max) || (max > (graph.maxDepth + 1)))
				node.setData("alpha",1,"end");
		});

		this.fgraph.animate({
			   modes: ['node-property:alpha'],
			   duration: 5,
		});
	},

	// Loads and Displays a graph. 
	// Either passed by argument or implicitly
	// by using this.objectData, which MUST not be null
	loadGraph: function() {

		if (!this.initGraph(this.fgraph))
			return false;

		var me = this;

		//load JSON data
		this.loadData(undefined);

		//Calculate a proper levelDistance so that the nodes don't overlap
		var minSpan = Math.PI * 2;
		var maxDepth = 0;
		this.fgraph.graph.eachNode(function(n) {
			if (n._depth == 1 && n.endData.$span < minSpan) {
				minSpan = n.endData.$span;
			}
			if (n._depth > maxDepth) {
				maxDepth = n._depth;
			}
		});
		if (90 / minSpan > this.fgraph.config.levelDistance) {
			this.fgraph.config.levelDistance = 90 / minSpan;
			this.fgraph.compute('end');
		}
		this.fgraph.config.background.levelDistance = this.fgraph.config.levelDistance;
		this.addBackground(this.fgraph);
		this.fgraph.computeIncremental({
			iter: 80,
			property: 'end',
			onStep: function(perc){
			},
			onComplete: function(){
				me.fgraph.animate({
					modes: ['node-property:alpha'],
					duration: 0,
					onComplete: function(){
						me.fgraph.animate({
							modes:['polar'],
							transition: $jit.Trans.Elastic.easeOut,
							duration: 2500
						});
					}
				});
			}
		});
	},

	addBackground:function(graph) {
		graph.canvas.canvases[1].clear();
		graph.canvas.canvases[1].opt.levelDistance = graph.config.levelDistance;
		graph.canvas.scale(1, 1);
		return graph;
	},

});
