// Checkboxes
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/on',
		'dojo/query',
		'dojo/dom-attr',
		'src/_FormWidgetBase',
		'dojo/NodeList-traverse'
		], 

function(declare, lang, array, on, query, domAttr, _FormWidgetBase){

return declare('Dropdown', [_FormWidgetBase], {

	elementClass: '.element.select',

	items: null,

	selector: null,

	initWidget: function() {
		this._initDropdown();
	},

	_initEvent: function() {
		on(this.domNode, "change", lang.hitch(this, "eventhandler"));
	},

	eventhandler: function(e){
		this.inherited(arguments);
	},

	_initDropdown: function() {
		this.selector = query(this.elementClass, this.domNode)[0];
		this.items = [];
		array.forEach(this.selector.options, function(item, i){
			this.items.push({
				domNode: item,
				id: i,
				value: item.value,
				label: item.innerText,
				rule: domAttr.get(item, 'rule')
			});
		}, this);
	},

	remove: function() {

	}




});
});