/**
 * @class Ext.ux.form.field.DateTime
 * @extends Ext.form.FieldContainer
 * Based on:
 * @author atian25 (http://www.sencha.com/forum/member.php?51682-atian25)
 * @author ontho (http://www.sencha.com/forum/member.php?285806-ontho)
 * @author jakob.ketterl (http://www.sencha.com/forum/member.php?25102-jakob.ketterl)
 */
Ext.define('Ext.ux.form.field.DateTime', {
    extend:'Ext.form.FieldContainer',
    mixins:{
        field:'Ext.form.field.Field'
    },
    alias: 'widget.xdatetime',

    //configurables

    combineErrors: true,

    /**
     * @cfg {String} dateFormat
     * The default is 'Y-m-d'
     */
    dateFormat: 'Y-m-d',
    /**
     * @cfg {String} timeFormat
     * The default is 'H:i:s'
     */
    timeFormat: 'H:i:s',
    /**
     * @cfg {String} dateTimeFormat
     * The format used when submitting the combined value.
     * Defaults to 'Y-m-d H:i:s'
     */
    dateTimeFormat: 'Y-m-dTH:i:s',
    /**
     * @cfg {Object} dateConfig
     * Additional config options for the date field.
     */
    dateConfig:{},
    /**
     * @cfg {Object} timeConfig
     * Additional config options for the time field.
     */
    timeConfig:{},

    // properties

    dateValue: null, // Holds the actual date
    /**
     * @property dateField
     * @type Ext.form.field.Date
     */
    dateField: null,
    /**
     * @property timeField
     * @type Ext.form.field.Time
     */
    timeField: null,

    items: [{
		xtype: 'datefield',
		name: 'date',
		frame: false,
		flex:1,
		submitValue:false
	}, {
		xtype: 'timefield',
		name: 'time',
		format : "H:i",
		frame: false,
		flex:1,
		submitValue:false
    }],

    initComponent: function(){
		this.callParent();
		this.dateField = this.items.items[0];
		this.timeField = this.items.items[1];
    },

    focus:function(){
        this.callParent();
        this.dateField.focus();
    },

    onItemFocus:function(item){
        if (this.blurTask) this.blurTask.cancel();
        this.focussedItem = item;
    },

    onItemBlur:function(item){
        var me = this;
        if (item != me.focussedItem) return;
        // 100ms to focus a new item that belongs to us, otherwise we will assume the user left the field
        me.blurTask = new Ext.util.DelayedTask(function(){
            me.fireEvent('blur', me);
        });
        me.blurTask.delay(100);
    },

    getValue: function(){
        var value = null,
            date = this.dateField.getSubmitValue(),
            time = this.timeField.getSubmitValue();

        if(date) {
            if(time) {
                var format = this.getFormat();
                value = Ext.Date.parse(date + ' ' + time, format);
            } else {
                value = this.dateField.getValue();
            }
        }
        return value;
    },

    setValue: function(value) {
        if (Ext.isString(value)) {
            value = Ext.Date.parse(value, this.dateTimeFormat);
        }
        this.dateField.setValue(value);
        this.timeField.setValue(value);
    },

    getFormat: function(){
        return (this.dateField.submitFormat || this.dateField.format) + " " + (this.timeField.submitFormat || this.timeField.format);
    },
});

//eo file

