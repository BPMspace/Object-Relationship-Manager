describe("During initialization...", function() {
	var stores =[],objectStore=null;_item=null;
		beforeEach(function(){
		});
    it("ExtJS4 has been loaded", function() {
        expect(Ext).toBeDefined();
        expect(Ext.getVersion()).toBeTruthy();
        expect(Ext.getVersion().major).toEqual(4);
    });

    it("ORM code has been loaded",function(){
        expect('Rob').toBeDefined();
    });

    it("Object Store is loadable",function(){
        var store = Ext.getStore("Object").load();
        waitsFor(
            function(){ return !store.isLoading(); },
            "store has wrong number of elements: " + store.getCount(),
            400
        );
    });

    it("Attrib Store is loadable",function(){
        var store = Ext.getStore("Attribute").load();
        waitsFor(
            function(){ return !store.isLoading(); },
            "store load never completed",
            400
        );
    });

    it("Relation Store is loadable",function(){
        var store = Ext.getStore("Relation").load();
        waitsFor(
            function(){ return !store.isLoading(); },
            "store load never completed",
            400
        );
    });
	
    it("All stores exist now",function(){
        expect( Ext.getStore("Relation") && Ext.getStore("Attribute") && Ext.getStore("Object") ).toBeTruthy();
    });

    it("We can define the object hierarchy and load the TreeStore implicitally",function(){
        
        objectStore = Ext.getStore("Object").each(function(item) {
       	this._item=item;
       	spyOn(item, "defineModel").andCallThrough();
   		spyOn(item, "defineStore").andCallThrough();

        item.define();
        
     	expect(item.defineModel).toHaveBeenCalled();
     	expect(item.defineStore).toHaveBeenCalled();

       
        stores.push(item);});
           
        expect( Ext.getStore("dir1") ).toBeDefined();
        expect( Ext.getStore("dir2") ).toBeDefined();
        expect( Ext.getStore("dir3") ).toBeDefined();
        expect( Ext.getStore("dir4") ).toBeDefined();
    });
  
    it ("Instances are loadable", function (){
     var instanceNames =["leaf1","leaf2","leaf3","test4","test2"];
   
        for (var j= 0; j<stores.length;j++)
        {
        	Ext.getStore(stores[j].get("sName")).each(function(instance)
            {
            	expect (instance).toBeDefined();
        		expect(instanceNames).toContain(instance.get("name")); 
        		return true;
        
            })
        }       	
    })
    afterEach(function() 
    {
    })        
  }); 
    //TODO: Check if Attributes and Relations are loadable, if pre- included in the database
    
