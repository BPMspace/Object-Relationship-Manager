describe("The Viewport...", function() {
	var view;

    beforeEach(function(){
		view=Ext.ComponentQuery.query("viewport")[0];
	});

 	it("should be defined",function(){
		expect(view).toBeDefined();
		expect(view.rendered).toBeTruthy();
	});
	it ("should include the treeview",function(){
		expect(view.down("tree")).toBeDefined();
		expect(view.down("tree")).not.toBeNull();

	})
	it ("should have the container for the right side",function(){
		expect(view.down("container")).toBeDefined();
		expect(view.down("container")).not.toBeNull();

	})
    
 	
});
