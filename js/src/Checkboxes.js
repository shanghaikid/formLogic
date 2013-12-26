// Checkboxes
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/on',
		'src/_FormWidgetBase'
		], 

function(declare, lang, array, on, _FormWidgetBase){

return declare('Checkboxes', [_FormWidgetBase], {

	elementClass: '.element.checkbox',

	_initEvent: function() {
		array.forEach(this.items, function(item) {
			on(item.domNode, "click", lang.hitch(this, "eventhandler"));
		}, this);

	},

	defaultStatusKey: 'checked',

	defaultStatusValue: true,

	initActionMap: function(){
		this.inherited(arguments);
		this.actionMap.mutex = this.mutex;
	},

	eventhandler: function(e){
		this.inherited(arguments);
	},

	mutex: function(id) {
		var item = this._getItem(id);
		this.reset();
		this.disable();
		this.enable(item);
		this.check(item);
	},

	undoAction: function() {
		this.reset();
	}






});
});