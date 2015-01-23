/*
 * A collection of small functions,
 * that need to go somewhere
 */

Ext.util.Format.comboRenderer = function(combo){
	// selecting the first record
	var record = combo.findRecord(1);
	return record ? record.get(combo.displayField) : combo.valueNotFoundText;
}

// This is validation code.
// custom Vtype for vtype:'objectDefined'
Ext.apply(Ext.form.field.VTypes, {
	objectDefined:  function(v) {
		return Ext.getStore("Object").findExact("name", v) == -1;
	},
	objectDefinedText: 'Name already defined',
});

// TODO move me
function keys2storeIdx(store, keys) {
	var idxs = undefined;
	if (keys  && (keys != "")) {
		idxs = [];
		for(var i = 0; i < keys.length; i++) {
			var idx = store.findExact("id", keys[i]); 
			if (idx > -1)
				idxs.push(store.findExact("id", keys[i]));
			else
				console.log("Could not find element id " + keys[i] + " in store " + store.storeId);
		}
	}
	return idxs;
}

// All arrays are stored as strings, separated normally by " "
// These two functions help greatly
Ext.String.arrayAdd = function (array, item, sep) { 
	sep = sep ? sep : " ";
	var a = [];

	if (!Ext.isEmpty(array))
		a = array.split(sep); 

	a.push(item); 
	return a.join(sep); 
}

Ext.String.arrayRem = function (array, rem, sep) { 
	sep = sep ? sep : " ";
	var a = array.split(sep); 
	var a2 = [];

	if (Ext.isEmpty(array))
		return "";

	Ext.each(a, function(item) {
		if ((item != "") && (item != rem)) {
			a2.push(item);
		}
	});
	return a2.join(sep); 
}

// A "missing" function in Ext. findRecord will return first match
// but we need an Exact match
Ext.data.Store.prototype.findExactRecord = function(property, value) {
	if (Ext.isEmpty(value))
		throw new Error("Passed no value parameter, probably you forgot to set the property parameter");

	var idx = this.findExact(property, value);

	if (idx < 0)
		return undefined;

	return this.getAt(idx);
}

Rob.findRecord = function(id) {
	var tree = Ext.getStore("Tree");
	var node = tree.getNodeById(id);
	var record = undefined;

	try {
		record = Ext.getStore(node.get("parentId")).findExactRecord("id", id);
	} catch (e) {
		console.log("Warning, record " + id + " not found in store " + node.parentId);
	}
	return record;
}

Rob.getEdge = function(id) {
	return Ext.getStore("Relation").findExactRecord("id", id);
}

Rob.currentObject = function() {
	var t = Ext.History.getToken();
	if (Ext.isEmpty(t)) 
		t = [];
	else
		t = t.split('/');
	
	try {
		switch (t.length) {
			case 3:
				var r = Ext.getStore("Object").findExactRecord("sName", t[2]);
				return { isObject: true, id: r.get("id"), store: t[2] };
			case 4:
				return { isObject: false, id: t[3], store: t[2] }
			default: return { isObject: false, id: undefined, store: undefined };
		}
	} catch (e) {
		return { isObject: false, id: undefined, store: undefined };
	}
}


