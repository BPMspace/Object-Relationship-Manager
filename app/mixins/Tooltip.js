Ext.define('Rob.mixins.Tooltip', { 
	mixins: {
		format: 'Rob.mixins.Format',	
	},
	
	checkTooltip: function (object, instance, decision)
	{
		var a;
	
		switch(decision)
	          	{
	          		case "object":decision = (a=this.createObjectTooltip(object));break;
	          		case "instance":decision = (a= this.createInstanceTooltip(object, instance));break;
	          		case "":decision = console.log("No data found to tooltip. Where is my data?");break;
	          		return a;
	          	}
	    return a;
	},
	createInstanceTooltip: function (object, instance)
	{
		console.log(instance);
		if (Ext.isObject(instance))
		{
		var attributes =  Rob.ReferenceManager.getInstanceAttributeNamesAndValues(object,instance);
		var relations = Rob.ReferenceManager.getInstanceRelationNameAndValues(object, instance);
		var formattedAttributes = this.format (attributes, "attributeTooltip");
		var formattedRelations = this.format (relations, "relationTooltip");
		var formattedTtle = this.format (instance, "instanceTitle");
		if (formattedAttributes && formattedRelations && formattedTtle)
		{
			var tooltip = formattedTtle + formattedAttributes + formattedRelations;
			return tooltip;
		}
		}
		else return;
	},
	
	createObjectTooltip: function (object)
	{
		
		if (Ext.isObject(object))
		{
		var formattedTtle = this.format (object, "instanceTitle");
		var instance_array =["Instances: </br>"];
		Ext.getStore(object.get("sName")).each(function(objectInstance) 
		{
			if (objectInstance)
			instance_array.push(this.format(objectInstance,"instance"));
			else instance_array.push( ("No instances"));
			
			return instance_array;
		},this);
		if (formattedTtle && instance_array)
		{
			console.log( "Object Tooltip Success!");
			var tooltip = formattedTtle + instance_array.join(" ");
		}
		return tooltip;
		}
		
		else return;
	}
	
	
})