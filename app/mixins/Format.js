Ext.define('Rob.mixins.Format', { 
	
		
	//Formatting class
	//Formats tooltip, grids, links,...
	
	format: function (array, decision)
	{
		var a;
		
		switch(decision)
	          	{
	          		case "attribute":decision =  (a=this.formatAttribute(array));break;
	          		case "relation":decision =  (a=this.formatRelation(array));break;
	          		case "instanceTitle":decision =  (a=this.formatTitle(array));break;
	          		case "instance":decision =(a=this.formatInstance(array));break;
	          		case "attributeTooltip":decision =(a= "Attributes </br>" +this.formatAttribute(array).join (" "));break;
	          		case "relationTooltip":decision =(a= this.formatTooltipRelation(array));break;
	          		case "":decision = console.log("Nothing found to format");break;
	          		return a;
	          	}
	     return a;
	      
	},
	//Formats attribute name/value pairs (e.g. for InstanceInfo) and tooltips
	
	formatAttribute: function (attr_array)
	{
		
			var counter =1;
			var array = attr_array;
            for (var i in array)
            {
            	if (array[i][1] =="" || array[i][1]==null)
            	{
            		array[i][1] =["Nothing selected"];
            	}
          	array[i]=counter + ". "+ array[i][0] +": "+ array[i][1]+ "</br>";
            counter++;
            }
          
			array = this.isNull(array, " Attributes");
            //array.join (" ");
            return array;
	},
	
	// Format Relations in a tooltip
	formatTooltipRelation: function (array)
	{
		var counter =1;

		for (var i in array)
            {
            	if (array[i][1].length==0)
            	{
            		array[i][1][0] =["Nothing selected"];
            	}
            
            if (Ext.isObject(array[i][2]))
            {
            	var obj = array[i][2].get('name');
            }
            else var obj =array[i][2];
            if (Ext.isObject(array[i][1][0]))
            {
	           var instance_relation = array[i][1][0].data.name;
            }
            else var instance_relation =  array[i][1][0];
            
            array[i] = [counter+ '. '+array[i][0] +': '+ instance_relation + ' to Object: ' + obj + ' Cardinality:'+ array[i][3].data.cardinality +'</br>'];
            
            counter++;
            }
            array = this.isNull(array, " Relations </br>");
		
            return "Relations</br>" + array.join (" ");
	},
	
	formatRelation: function (rel_array)
	{
		var counter =1;
		var array =rel_array;
		
		for (var i in array)
            {
            	if (array[i][1].length==0)
            	{
            		array[i][1][0] =["Nothing selected"];
            	}
            
            if (Ext.isObject(array[i][2]))
            {
            		var link_array = [array[i][2].get("sName"), array[i][2].get('name')];
            		var obj_link = this.formatLink(link_array, "object");
            		//var obj_link = Ext.String.format('<a href="#/root/{0}">{1}</a>', array[i][2].get('sName'),array[i][2].get('name'));
            }
            else var obj_link =array[i][2];
         
            if (Ext.isObject(array[i][1][0]))
            {
	                  var link_array = [array[i][2].get("sName"),array[i][1][0].data.id, array[i][1][0].data.name];

	            	//var instance_relation_link = Ext.String.format('<a href="#/root/{0}/{1}">{2}</a>', array[i][2].get('sName'),array[i][1][0].data.id, array[i][1][0].data.name+'');
					instance_relation_link = this.formatLink(link_array,"instance");
	           
            }
            else var instance_relation_link =  array[i][1][0];
            
            array[i][0] = [counter+ '. '+array[i][0] +': '+ instance_relation_link];
            array[i][1]=  [' to Object: ' + obj_link + ' Cardinality:'+ array[i][3].get('cardinality') +'</br>'];
            
            counter++;
            }
            array = this.isNull(array, " Relations");
		
            return array;
	},
	
	formatTitle: function (instance)
	{
		var title = "<h5>" + instance.data.name + "</h5> </br>";
		return title;
	},
	
	//Converts object strings to links (navigation)
	formatLink: function (array, kind_of_link)
	{
		if (kind_of_link =="object")
		{
		link = Ext.String.format('<a href="#/root/{0}">{1}</a>', array[0],array[1]);
		}
		else if (kind_of_link = "instance")
		{
		link = Ext.String.format('<a href="#/root/{0}/{1}">{2}</a>', array[0],array[1],array[2]+'');
		}
		return link;
	},
	formatInstance: function (array)
	{
		return  array.data.name + "</br>";
	},
	
	isNull: function (array, kind)
	{
		if (array.length ==0)
		{
			array = ["No" + kind + "</br>"];
		}
		return array;
		
	}
	
})