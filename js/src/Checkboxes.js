// Checkboxes
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/query',
		'dojo/on',
		'dojo/dom-construct',
		'src/_FormWidgetBase'
		], 

function(declare, lang, array, query, on, domConstruct,_FormWidgetBase){

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

	_initActions: function() {
		this.inherited(arguments);
		this.actions.push({
			label: '互斥',
			action: 'mutex',
			widgetAction: true
		});

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