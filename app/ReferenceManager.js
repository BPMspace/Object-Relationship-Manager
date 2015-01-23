/*
 * Central Databases of Object Relations.
 *
 * If objects A and B have a relation C 
 * each actual edge between object insances a and b 
 * is stored inside a under a variable named C (a.C)
 *
 * In the API relationid is C, a and b are reflected by the objectid param.
 *
 * Therefore, to get b's inrefs, we need to consult all Object instances of A.
 * Sounds inefficient, but avoids dublicated data retention.  Furhtermore, this
 * class encapsulates everything, hence you can simply reimplement it, trading
 * speed with memory.
 *
 */
Ext.define('Rob.ReferenceManager', {

	statics: {

		getOutRefs: function(relationid, objectid) {
				var relation = Ext.getStore("Relation").findExactRecord("id", relationid);
				var outGoinObjectRecord = Ext.getStore("Object").findExactRecord("id", relation.get("from"));
				var store = Ext.getStore(outGoinObjectRecord.get("sName"));
				var record = store.findExactRecord("id", objectid);

				if (!record || typeof(record) === 'undefined' || record == null)
					return [];

				var items = record.get(relationid);
				if (!items || typeof(items) === 'undefined' || items == null || items == "")
					return [];

				var incOmngObjectRecord = Ext.getStore("Object").findExactRecord("id", relation.get("to"));
				store = Ext.getStore(incOmngObjectRecord.get("sName"));
				var ret = [];
				Ext.each(items.split(" "), function(itemid) {
					rec = store.findExactRecord("id", itemid);
					ret.push(rec);
				});
				return ret;
		},

		getInRefs: function(relationid, objectid) {
			var ret = [];
			try {

				var relation = Ext.getStore("Relation").findExactRecord("id", relationid);
				var outGoinObjectRecord = Ext.getStore("Object").findExactRecord("id", relation.get("from"));
				var store = Ext.getStore(outGoinObjectRecord.get("sName"));

				console.log("Searchin in Store " + store.storeId);

				store.each(function(rec, index) {
					var items = rec.get(relationid);
					if (items == null)
						return true;
					if (items == "")
						return true;
					if (Ext.Array.contains(items.split(" "), objectid))
						ret.push(rec);
				});

			} catch (e) {
				console.log("Problem getting InRefs " + e);
			}
			return ret;
		},

		updateInrefs: function(relationid, objectid, oldIds, newIds) {

			var relation = Ext.getStore("Relation").findExactRecord("id", relationid);
			var outGoinObjectRecord = Ext.getStore("Object").findExactRecord("id", relation.get("from"));
			var store = Ext.getStore(outGoinObjectRecord.get("sName"));
			var cardinality = relation.get("cardinality").substr(-1,1);

			console.log("UpdateInRefs: " + oldIds + " (old) -> " + newIds);

			// Here records that should not be removed ARE removed, BUT added back 
			// immediately afterwards.
			oldIds.forEach(function(item) {
				if (Ext.isEmpty(item)) return true;

				var oldRecord = store.findExactRecord("id", item);
				if (oldRecord) {
					if (cardinality == "1")
						oldRecord.set(relationid, "");
					else
						oldRecord.set(relationid, Ext.String.arrayRem(oldRecord.get(relationid), objectid));
				}
			});

			newIds.forEach(function(item) {
				var newRecord = store.findExactRecord("id", item);

				if (newRecord) {
					if (cardinality == "1")
						newRecord.set(relationid, objectid);
					else
						newRecord.set(relationid, Ext.String.arrayAdd(newRecord.get(relationid), objectid));
				} else {
					console.log("New Record NOT FOUND");
				}
			});

			/*
			var m = Ext.create('Ext.LoadMask', Ext.getCmp("nav-content"), {
				store: store 
			});
			m.show();

			store.on('update', function() { 
				var task = new Ext.util.DelayedTask(function(){
					this.setValue(); 
					m.hide();
				}, this);
				task.delay(50);
				}, this, {single: true});
		*/
			store.sync();
		},

		/**
		 * Function to "reassign" records
		 * Therefore we check NEW references for their previous incomming refs
		 * As we only need to do this in a cardinality 1:something case, we simply 
		 * set the old incomming ref to ""
		 */
		updateOutRefs: function(oldids, store, newids, id, relationid, cardinality) {
			if (cardinality.substr(0,1) == "n")
				return true;

			if (newids.join(" ") == oldids.join(" "))
				return true;

			console.log("Reassigning..." + newids + " old " + oldids);

			// No need to delete no longer referenced outrefs, 
			// they are deleted automatically
			// Hint: join(readGrid())

			// But need to reassign new ids
			Ext.each(Ext.Array.difference(newids, oldids), function(item) {
				var k = Rob.ReferenceManager.getInRefs(relationid, item);
				Ext.each(k, function(record) {
					if (record.get("id") == id) return;
					console.log("Removing from " + record.get("name"));
					record.set(relationid, Ext.String.arrayRem(record.get(relationid), item));
				});
			});

			return true;
		},
		// Finds attribute names and values to a given instance
		getInstanceAttributeNamesAndValues: function (object, instance) {
			if (!object) 
			{
				 object = Rob.ReferenceManager.getObjectToInstance(instance);
			
			}
				var attribarray =[];
				var attrib_value;
				var attrib_name;
				var attributes = object.get("attributes");
				if (!attributes) attributes =="";
				Ext.each(attributes.split(" "),function(item) 
				{
					if (item=="") return;
					
					var split = item.split(".");
					var attributeId = split[1];
					attrib_value = instance.get(attributeId);
					attrib_name = Ext.getStore("Attribute").findExactRecord("id", attributeId).get("name");
					attribarray.push([attrib_name,attrib_value]);
				})
			//console.log(attribarray);
			return attribarray;
					
		},
		//Finds all information to relation of an instance
		//Returns array with  relation name, relation Value(array), target Object (relation_dest_obj) and the relation object itself
		getInstanceRelationNameAndValues: function (object, instance) {
			if (!object) 
			{
				 object = Rob.ReferenceManager.getObjectToInstance(instance);
			
			}
			
					var relationarray = [];
					var relation_value;
					var relations = object.get("relations");
					if (!relations) relations =="";
					var counter=1;
					
					Ext.each(relations.split(" "),function(item) 
					{
						if (!item) return;
						var split = item.split(".");
						var relationId = split[1];
						var relation_object = Ext.getStore("Relation").findExactRecord("id", relationId);
						var relation_cardinality = relation_object.get("cardinality");

						if (split[0]=="InRelation")
						{
						var relation_name = relation_object.get("name_ba");
						var relation_dest_obj = Ext.getStore("Object").findExactRecord("id",relation_object.get("from"));
						relation_value = Rob.ReferenceManager.getInRefs(relationId, instance.data.id);
						}
						else 
						{
						var relation_name =  relation_object.get("name_ab");
						var relation_dest_obj = Ext.getStore("Object").findExactRecord("id",relation_object.get("to"));
						
						relation_value = Rob.ReferenceManager.getOutRefs(relationId, instance.data.id);

						}
					//console.log(relation_dest_obj);
					relationarray.push([relation_name,relation_value, relation_dest_obj, relation_object]);
					//console.log(relationarray);
					});
					return relationarray;
		},
		
		//Finds the corresponding Object to a given Instance
		getObjectToInstance: function (instance) {
			return Ext.getStore("Object").findExactRecord("sName", instance.store.storeId);

		}
	
	},


});

