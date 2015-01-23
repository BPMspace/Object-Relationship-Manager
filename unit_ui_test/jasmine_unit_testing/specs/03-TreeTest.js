var treepanel =null, treeview= null,navigationcontroller = null,view = null, item =null;

describe ("The TreeView...", function(){
	beforeEach(function(){
		view=Ext.ComponentQuery.query('viewport')[0];

		treeview=Ext.ComponentQuery.query('tree')[0];
		treepanel = treeview.down("treepanel");		
	});
	it("should be defined",function(){
		expect(treeview).toBeDefined();
		expect(treeview.rendered).toBeTruthy();
	});
	
	
	it ("should find the treepanel and its Id reference" , function (){
  	
	 expect(treepanel).toBeDefined();
     expect(treepanel).not.toBeNull();	
 	 expect(treepanel.id).toEqual("nav-region");
 	 
   });
   // How do i test that? Destroying the models and recall item.define? (So defineView is called and i can test the read Method in Tree.js?)
   it("should have loaded the Tree store", function(){
   		
	   expect (treepanel.getStore()).toBeDefined();
	   expect(treepanel.getStore().proxy.type).toEqual ("storereader");
	  
	 });
	it ("should have loaded the Tree now", function(){
		//General assumptions
		expect(treepanel.getRootNode()).toBeTruthy();
		expect(treepanel.getRootNode().childNodes.length).toBe(4);
		expect(treepanel.getRootNode().data.id).toEqual("root");
		expect(treepanel.getRootNode().data.leaf).toBeFalsy();
		//Check if Objects can be found in the Tree hierarchy and if the hierarchy has Directories and leafs
		expect(treepanel.getRootNode().firstChild).not.toBeNull();
		expect(treepanel.getRootNode().firstChild.data.leaf).toBeFalsy();
		expect(treepanel.getRootNode().firstChild.expand()).not.toBeNull();
		expect(treepanel.getRootNode().firstChild.firstChild).not.toBeNull();
		expect(treepanel.getRootNode().firstChild.firstChild.data.leaf).toBeTruthy();
		});
	 
});

describe ("To navigate within the tree...", function(){
   
	
	it ("the navigation controller should be instantiated", function (){
 	navigationcontroller = Rob.ORM.getController("Navigation");
 	navigationcontroller.init();
 	expect(navigationcontroller).toBeDefined();
 	expect(navigationcontroller).not.toBeNull();
   	});
   
    it ("the navigation controller should be able to access the navigation (treepanel) reference", function(){
   	expect(navigationcontroller.getNav()).not.toBeNull();

   }),
   it ("the navigation controller should be able to access the tree reference", function(){
   	expect(navigationcontroller.getTree()).not.toBeNull();

   });
   it (" specific Tree Nodes should be found and selected by the navigation Controller", function(){

 		expect(navigationcontroller.getTree().getRootNode()).not.toBeNull();
		expect(navigationcontroller.getTree().getRootNode().findChild("id", 'dir1')).not.toBeNull();
		expect(treepanel.getRootNode().firstChild.expand()).not.toBeNull();
		expect(navigationcontroller.getTree().getRootNode().findChild("text", 'leaf1', true)).not.toBeNull();
		
 	});
   
   it ("the navigation controller should be able to call the treeload Function", function(){
 	spyOn(navigationcontroller, "reloadFolder");

	Rob.ORM.fireEvent("ObjectInstanceRemoved", undefined, "nonexisting");
 	//navigationcontroller.treeload();
	expect(navigationcontroller.reloadFolder).toHaveBeenCalled();
	expect(navigationcontroller.reloadFolder.callCount).toBeGreaterThan(0);
   	});
   	 it ("the navigation controller should be able to select a Node", function(){
   	 var token= "/root/dir1/8af3173f5c4f432fbb5ec3efaa31b812";
   	 expect(navigationcontroller.getTree().getRootNode().findChild("id", '8af3173f5c4f432fbb5ec3efaa31b812', true)).not.toBeNull();

 	spyOn(navigationcontroller, "selectHistoryNode").andCallThrough();
 	spyOn(navigationcontroller.getTree(), "selectPath").andCallThrough();

 	spyOn(navigationcontroller, "switchPage").andCallThrough();
	navigationcontroller.selectHistoryNode(token);
	
 	expect(navigationcontroller.selectHistoryNode).toHaveBeenCalled();
 	expect(navigationcontroller.getTree().selectPath).toHaveBeenCalled();

 	expect(navigationcontroller.switchPage).toHaveBeenCalled();

   	});
   	
   
	});
