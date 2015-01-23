Ext.define('Rob.mixins.StarfieldSimulation', {

	// Start visualisation here
	initGraph: function(graph) {

		if (graph) return true;
		if (this.hidden) return false;

		this.defineGraphCmps();

		//init RGraph
		var rgraph = new $jit.ForceDirected({
			//Where to append the visualization
			injectInto: 'infovis-body',
			labels: false,
			levelDistance: 200,
			withLabels: false,

			background: { // The circles
				CanvasStyles: {
					strokeStyle: '#555'
				}
			},

			//Add navigation capabilities:
			//zooming by scrolling and panning.
			//Set Node and Edge styles.
			Node: {
				overridable: true,
				dim: 6,
				height: 100,
				width: 200,
				textcolor: '#C17878',
				//type: 'greenapple',
				type: 'button',
			},
			Edge: {
				overridable: true,
				color: '#C17878',
				lineWidth:2,
			},

			Navigation: {
				enable: true,
				type: 'Native',
				//Enable panning events only if we're dragging the empty
				//canvas (and not a node).
				panning: 'avoid nodes',
				zooming: 10 //zoom speed. higher is more sensible
			},

			Events: {
				enable: true,
				type: 'Native',
				//Change cursor style when hovering a node
				onMouseEnter: function(e) {
					rgraph.canvas.getElement().style.cursor = 'move';

				},
				onMouseLeave: function() {
					rgraph.canvas.getElement().style.cursor = '';
				},
				//Update node selection rectangle
				onClick: function(node, eventInfo, e) {

					rgraph.graph.eachNode(function(n){
						if(n.id != node.id) delete n.selected;
						else if(n.id==node.id&& n.selected) {
							delete n.selected;
							n.selected=false;
						} else n.selected=true;
					});
					rgraph.plot();
					var f = Ext.Function.createBuffered(function () {
						var path = "/graph/";
						if (!node) return;
						console.log(node);
						if (node.data.hasOwnProperty("parentId"))
							path = path + node.data.parentId + "/" + node.id;
						else
							path = path + node.data.sName;
						Ext.History.add(path);
					}, 100, this, node);
					return f(1);
				},
				//Update node positions when dragged
				onDragMove: function(node, eventInfo, e) {
					var pos = eventInfo.getPos();

					rgraph.graph.eachNode(function(n){
						 delete n.selected;
					});

					node.pos.setc(pos.x, pos.y);
					node.setPos(new $jit.Complex(pos.x, pos.y), "start");
					node.setPos(new $jit.Complex(pos.x, pos.y), "end");
					node.selected=true;

					rgraph.plot();
				 },
				 onDragEnd: function(node, eventInfo, e){
				 	var f = Ext.Function.createBuffered(function () {
					Ext.getCmp('nav-region').fireEvent('NodeSelected',node);
					}, 100, this, node);
					return f(1,2,3);
				 },
				//Implement the same handler for touchscreens
				onTouchMove: function(node, eventInfo, e) {
					$jit.util.event.stop(e); //stop default touchmove event
					this.onDragMove(node, eventInfo, e);
				},
				
				// Label Standard functionality
				// Maybe relevant in later releases, standard functions following
				onCreateLabel: function(domElement, node){
			      domElement.innerHTML = node.name;
			      var style = domElement.style;
			      style.fontSize = "0.8em";
			      style.color = "#fff";
			    },
			    // Change node styles when DOM labels are placed
			    // or moved.
			    onPlaceLabel: function(domElement, node){
			      var style = domElement.style;
			      var left = parseInt(style.left);
			      var top = parseInt(style.top);
			      var w = domElement.offsetWidth;
			      style.left = (left - w / 2) + 'px';
			      style.top = (top + 10) + 'px';
			      style.display = '';
			    }
				
			},
		}); // Finished loading
		this.fgraph = rgraph;
		return true;
	},

	// All glue code for showing nicer labels
	defineGraphCmps: function() {
		
		$jit.ForceDirected.Plot.NodeTypes.implement({
			//This node type is used for plotting the upper-left pie chart
			
			'button': {
				
				'render': function(node, canvas) {
					
					function drawRoundButton(ctx, x, y, width, height, arcsize, text) {
						ctx.beginPath();
						ctx.moveTo(x+arcsize, y);
						ctx.lineTo(x+width-arcsize, y);
						ctx.arcTo(x+width, y, x+width, y+arcsize, arcsize);
						ctx.lineTo(x+width,y+height-arcsize);
						ctx.arcTo(x+width, y+height, x+width-arcsize, y+height, arcsize);
						ctx.lineTo(x+arcsize, y+height);
						ctx.arcTo(x, y+height, x, y-arcsize, arcsize);
						ctx.lineTo(x, y+arcsize);
						ctx.arcTo(x, y, x+arcsize, y, arcsize);
						ctx.lineTo(x+arcsize, y);
						ctx.stroke();
						ctx.fill();
						ctx.fillStyle = "rgb(0,20,20)";
						
						if (node.selected)
						{
							ctx.lineWidth=1; 
							ctx.strokeStyle= "#0000FF";
							ctx.stroke();							
						}
						else 
						{
							ctx.strokeStyle= "#000000";
							ctx.lineWidth=1; 
							ctx.stroke();
						}
						if (text)
							ctx.fillText(text, x + 5, y - 5 + height);
						
					};
					
					var offset = 5;
					var pos = node.getPos();
					var ctx = canvas.getCtx();
					var text = "NodeName";
					var dims = ctx.measureText(text);
					dims.height = 20;
					drawRoundButton(ctx, pos.x - dims.width, pos.y - dims.height/2, dims.width * 2, dims.height * 2, 5, node.name);
				},
				'contains': function(n, pos){
					var radius = n.Config.height / 2;
					var diffx = n.pos.x - pos.x,
						diffy = n.pos.y - pos.y,
						diff = diffx * diffx + diffy * diffy;
					return (diff <= radius * radius) * n.data.$alpha;
				},
			},
			'greenapple': {
				'render': function(node, canvas) {
					var pos = node.pos.getc(true);
					var ctx = canvas.getCtx();
					var measure = ctx.measureText(node.name);
					var width = Ext.max([node.getData('width') + 5 , measure.width]);
					var height = node.getData('height');
					var greenapple = new Image();
					greenapple.src = "images/green_button.svg";
					greenapple.width = width;
					greenapple.height = height;
					var dim = node.getData('dim');
					ctx.drawImage(greenapple,pos.x-width/2,pos.y-height/2, width, height);
					ctx.fillText(node.name, pos.x - measure.width/2, pos.y + 3);
				},
				'contains': function(n, pos){
					var radius = n.Config.height / 2;
					var diffx = n.pos.x - pos.x,
						diffy = n.pos.y - pos.y,
						diff = diffx * diffx + diffy * diffy;
					return diff <= radius * radius;
				}
			}
		});
		
		//Special edges with labels
		$jit.ForceDirected.Plot.EdgeTypes.implement({
            'labeled': {
              'render': function(adj, canvas) {
                this.edgeTypes.line.render.call(this, adj, canvas);
                var data = adj.data;
                if(data.labeltext) {
            
		          var ctx = canvas.getCtx();
                  var posFr = adj.nodeFrom.pos.getc(true);
                  var posTo = adj.nodeTo.pos.getc(true);
                  ctx.fillStyle= '#fff';
                  ctx.fillText(data.labeltext, (posFr.x + posTo.x)/2, (posFr.y + posTo.y)/2);
                }
              }
            }
          });
	
		return true;
	},

	computeGraphData: function() {
		var data = [];

		Ext.getStore("Object").each(function(objectType) {
			var adjac = [];
			var edgeIds = objectType.get("relations").split(" ");
			var relationarray =[];
			edgeIds.forEach(function(edge) {
				edge = edge.split('.');
				if (edge[0] != "Relation")
					return true;

				var record = Ext.getStore("Relation").findExactRecord("id", edge[1]);
				if (!record)
					return;
				if (record.get("name_ab"))
					relationarray.push(record.get("name_ab"));
				else
					relationarray.push(record.get("name_ba"))


				adjac.push(
					record.get("to")
					//nodeTo: record.get("to"),
					//data:{
					// LabelText shows relation between Objects
					//BUT: relations are two way relations
					//Object<--->Object, so two edges between objects? Other ideas?

					// Labels for edges disabled. Enable following code piece to make labels visible
					//ATM one-way relations

					//labeltext:relationarray,
					//labelid: record.get('id')+ '-' + record.get("to")
					//}
					//}
				);
			});

			data.push({
				id: objectType.get("id"),
				name: objectType.get("name"),
				adjacencies: adjac,
				data: { sName: objectType.get('sName'), '$alpha': 0 },
			});
		});
		return data;
	},

	computeInstanceData: function() {
		var data = [];

		var treestore = Ext.getStore("Tree");
		treestore.getRootNode().childNodes.forEach(function(objectNode) {
			treestore.load({node: objectNode});
			var objectRecod = Ext.getStore("Object").findExactRecord("sName", objectNode.get("id"));
			var edgeIds = objectRecod.getRelations();
			objectNode.childNodes.forEach(function(instanceNode) {

				if (instanceNode.visible == false)
					return;

				var adjac = [];

				var oStore = Ext.getStore(instanceNode.get("parentId"));
				var obj = oStore.findExactRecord("id", instanceNode.get("id"));

				if (!obj)
					return;

				//console.log("Add node " + instanceNode.get("text"));
				edgeIds.forEach(function(edge) {
					if (Ext.isEmpty(edge)) return true;

					var relation = Ext.getStore("Relation").findExactRecord("id", edge);
					var filtered = false;

					if (!relation || filtered)
						return;

					var relations = obj.get(relation.get("id"));

					if (!relations)
						return;

					relations = relations.split(" ");

					for (var i in relations) {
						if (relations[i].length < 3)
							continue;
							adjac.push({
								nodeTo: relations[i],
								// TODO: Here we could set edge colors based on the 
								// edge id (which means colorizing nodes based on 
								// relation type. I would hoever need a random number generator 
								// that is salted with edge ids ;)
								//data: { $color: "#23A4FF" },
							});
					}
				});

				data.push({
					id: instanceNode.get("id"),
					name: instanceNode.get("text"),
					data: { parentId: instanceNode.get("parentId"), '$alpha': 0 },
					adjacencies: adjac,
				});
			}, this);
		}, this);
		return data;
	},

});
