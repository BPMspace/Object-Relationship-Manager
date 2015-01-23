// From http://www.learnsomethings.com/2011/09/30/extjs-4-clearable-combobox-ala-twintriggers-example/
// slightly modified
Ext.define('Ext.ux.ClearableCombo', {
	extend: 'Ext.form.field.ComboBox',
	alias: 'widget.xcombo',
	triggerTip: 'Click to clear selection.',
	trigger2Click: undefined,
	trigger1Class: 'x-form-select-trigger',
    trigger2Class: 'x-form-clear-trigger',
	onRender: function(ct, position){
		Ext.ux.ClearableCombo.superclass.onRender.call(this, ct, position);
		var id = this.getId();
		this.triggerConfig = {
            tag:'div', cls:'x-form-twin-triggers', style:'display:block;width:46px;', cn:[
            {tag: "img", style: Ext.isIE?'margin-left:-3;height:19px':'', src: Ext.BLANK_IMAGE_URL, id:"trigger1" + id, name:"trigger1" + id, cls: "x-form-trigger " + this.trigger1Class},
            {tag: "img", style: Ext.isIE?'margin-left:-6;height:19px':'', src: Ext.BLANK_IMAGE_URL, id:"trigger2" + id, name:"trigger2" + id, cls: "x-form-trigger " + this.trigger2Class}
        ]};	
		this.triggerEl.replaceWith(this.triggerConfig);
		this.triggerEl.on('mouseup',function(e){
			if(e.target.name == "trigger1" + id ){
				this.onTriggerClick();
			} else if(e.target.name == "trigger2" + id){
				if (typeof(this.trigger2Click) === 'function')
					this.trigger2Click();
			}
		}, this);
		var trigger1 = Ext.get("trigger1" + id);
		var trigger2 = Ext.get("trigger2" + id);
		trigger1.addClsOnOver('x-form-trigger-over');
		trigger2.addClsOnOver('x-form-trigger-over');
	}
});

