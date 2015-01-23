describe ("Relations...", function(){
	var createRel() {
	
	};
	var tree;
	var root;
	var content;
	beforeEach(function(){
		tree = Ext.getCmp("nav-region");
		content = Ext.getCmp("nav-content");
		root = tree.getRootNode();
	});
	it("We can switch page to some leaf and select the relations tab",function(){
		var node = node=root.findChild("text","leaf2",true);
		Rob.ORM.controllers.get("Navigation").onItemClick(undefined, node);
		var active = content.layout.getActiveItem();
		expect(active.xtype).toEqual("dir1");
		var relations = active.down("tabpanel").setActiveTab(1);
	});
	it("We can add relations",function(){
		var t = content.down("dir1");
		Rob.ORM.controllers.get("Object").onAddRelation(t.down());
		var r=Ext.ComponentQuery.query("rform")[0];
		expect(r).toBeDefined();
		r.down('[name=name_ab]').setValue("test1_1_name_ab");
		r.down('[name=name_ba]').setValue("test1_1_name_ba");
		r.down('[name=to]').select("d103d558d2ff47809fe7d9492051fd51");
		Rob.ORM.controllers.get("Object").onSaveRelation(r.down("[id=relationSave]"));
		r.up("window").close();
		var active;
		waitsFor(function() {
			active = content.layout.getActiveItem();
			return active.id == "dir1";
		}, 200);
	});
	it("And check if they are there",function(){
		var active = content.layout.getActiveItem();
		var relations = active.down("tabpanel").setActiveTab(1);
		expect(relations.items.last().fieldLabel).toEqual("test1_1_name_ab");
	});
});
