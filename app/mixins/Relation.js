Ext.define('Rob.mixins.Relation', {
	mixins: {
		format: 'Rob.mixins.Format',	
		tooltip: 'Rob.mixins.Tooltip'
	},
	getObjectId: function() {
		return this.up("object").getRecord().data.id;
	},
	getObject: function (){
		return this.up("object").getRecord();
	},

	comboBeforeSelect: function(combo, record, index, opts) {
		var objectid = record.get("id");

		if (objectid == this.getObjectId()) {
			Ext.Msg.alert("Alert", "Circular References are discouraged.");
			return false;
		}

		var c;
		if (this.relation=="Outgoing")
			c = this.cardinality.substr(0,1);
		else
			c = this.cardinality.substr(-1,1);

		console.log("Cardinality " + this.cardinality + "(" + c + ") relation " + this.relation );

		if (c == "n")
			return true;

		var k = [];

		if (this.relation=="Outgoing")
			k = Rob.ReferenceManager.getInRefs(this.relationid, objectid);
		else
			k = Rob.ReferenceManager.getOutRefs(this.relationid, objectid);

		if (k.length == 0 || k[0] == undefined || k[0].get("id") == this.getObjectId())
			return true;

		var collidingName = k[0].get("name");

		// Catch evend fired from select in Msg.show -.-
		if (this.passthrough) {
			this.passthrough = false;
			return true;
		}

		Ext.Msg.show({
			title:'Reassign ' + record.get("name") + "?",
			msg: 'Selecting the entry "' + record.get("name") + '" will reassign it from the value "' + collidingName + '"',
			buttons: Ext.Msg.OKCANCEL,
			icon: Ext.Msg.QUESTION,
			fn: function(buttonid) {
				if (buttonid == "ok") {
					this.passthrough = true;
					this.select(record, true, true);
				}
			},
			scope: this,
		});

		return false;
	},

	gridBeforeSelect: function(chckbx, record, index, opts) {
		var objectid = record.get("id");

		if (objectid == this.getObjectId()) {
			Ext.Msg.alert("Alert", "Circular References are discouraged.");
			return false;
		}

		var c;
		if (this.relation=="Outgoing")
			c = this.cardinality.substr(0,1);
		else
			c = this.cardinality.substr(-1,1);

		console.log("Cardinality " + this.cardinality + "(" + c + ") relation " + this.relation );

		if (c == "n")
			return true;

		var k;
		if (this.relation=="Outgoing")
			k = Rob.ReferenceManager.getInRefs(this.relationid, objectid);
		else
			k = Rob.ReferenceManager.getOutRefs(this.relationid, objectid);

		if (k.length == 0 || k[0] == undefined)
			return true;

		var me = false;
		var myid = this.getObjectId();
		Ext.each(k, function(item) {
			me |= myid == item.get("id");
		});

		if (me)
			return true;

		var collidingName = k[0].get("name");

		Ext.Msg.show({
			title:'Reassign ' + record.get("name") + "?",
			msg: 'Selecting the entry "' + record.get("name") + '" will reassign it from the value "' + collidingName + '"',
			buttons: Ext.Msg.OKCANCEL,
			icon: Ext.Msg.QUESTION,
			fn: function(buttonid) {
				if (buttonid == "ok") {
					this.getSelectionModel().select(index, true, true);
					this.updateGridTitle();
				}
			},
			scope: this,
		});

		return false;
	},

	updateGridTitle: function() {
		var names = this.readGrid(["id", "name"]);
		var objectRecord= Ext.getStore("Object").findExactRecord("id", this.objectRecordId);
		var namesInTitle = ["<a> Nothing Selected </a>"];
		var link_array = [objectRecord.get("sName"), objectRecord.get("name")];
		var objectName = this.formatLink(link_array, "object");//Ext.String.format('<a href="#/root/{0}">{1}</a>', objectRecord.get("sName"), objectRecord.get("name"));
		if(this.numSelectedItems()) {
			namesInTitle=[];
			var link_array2 =[];
			Ext.each(names, function(item) {
				link_array2 =[objectRecord.get("sName"), item[0], item[1]];
				var tooltip = this.createInstanceTooltip(null,Ext.getStore(objectRecord.get("sName")).findExactRecord("id",item[0]));
				
				namesInTitle.push("<span data-qtip='"+tooltip+"'>"+ this.formatLink(link_array2, "instance")+ "</span>");//Ext.String.format('<a href="#/root/{0}/{1}">{2}</a>', objectRecord.get("sName"), item[0], item[1]));
			}, this);
		} 
		var tooltip = this.createObjectTooltip(objectRecord);
		this.setTitle(this.fieldLabel + ": " +  namesInTitle.join(", ") + " in Object: <span data-qtip='"+tooltip+"'>" +  objectName + "</span>");
	},
	


	readGrid: function(type) {
		var v = [];
		var smu = this.getSelectionModel();

		smu.getSelection().forEach(function(item) {
			if (typeof(type) == "string")
				v.push(item.get(type));
			else { // Array support
				var a = [];
				Ext.each(type, function(t) {
					a.push(item.get(t));
				});
				v.push(a);
			}
		});
		v.sort();
		return v;
	},

	numSelectedItems: function() {
		var smu = this.getSelectionModel();
		return smu.getCount();
	},

	toolTipRenderer: function(value, meta, record) {

			var objectRecord= Ext.getStore("Object").findExactRecord("id", this.objectRecordId);

			var attribarray =[];
			var attributes = objectRecord.get("attributes");
			var attrib_value;

			if (!attributes) attributes =="";

				Ext.each(attributes.split(" "),function(item) 
				{
					if (item=="") return;

					var split = item.split(".");
					var attributeId = split[1];
					attrib_value = record.get(attributeId);
					var attrib_name = Ext.getStore("Attribute").findExactRecord("id", attributeId).get("name");

					if (attrib_value =="" || attrib_value==null)
					{
						attrib_value = "Nothing selected";
					}
					attribarray.push([attrib_name+ ': ' + attrib_value]+ '<br>');

					});

				 	if (attribarray.length==0)
					{
						attribarray = ["No Attributes"];
					}
					

					var relationarray = [];
					var relations = objectRecord.get("relations");
					var relation_value;
					if (!relations) relations =="";
					var counter=1;
					Ext.each(relations.split(" "),function(item) 
					{
						if (!item) return;
						var split = item.split(".");
						var relationId = split[1];
						var relation_object = Ext.getStore("Relation").findExactRecord("id", relationId);

						if (split[0]=="InRelation")
						{
						var relation_name = relation_object.get("name_ba");
						relation_value = Rob.ReferenceManager.getInRefs(relationId, record.data.id);

						}
						else 
						{
						var relation_name = relation_object.get("name_ab");
						relation_value = Rob.ReferenceManager.getOutRefs(relationId, record.data.id);
						}
						var relationInstanceToValue=[];
						for (var i in relation_value) {
							relationInstanceToValue.push(relation_value[i].get("name"));
						}
						if (relation_value.length==0)
						{
							relationInstanceToValue.push("Nothing selected");
						}
						relationarray.push([relation_name+ ": "+ relationInstanceToValue + '</br>']);

					});
						if (relationarray.length==0)
						{
							relationarray = ["No Relations"];
						}		
		meta.tdAttr= 'data-qtip="<h5>'+record.get('name')+'</h5><br> Attributes: </br>'+attribarray.join(' ')+'</br></br> Relations: </br>'+relationarray.join(' ')+'"';
		return Ext.String.format('<a href="#/root/{0}/{1}">{2}</a>', objectRecord.get("sName"),record.data.id, value);

		},
});
