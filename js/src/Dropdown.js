// Checkboxes
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/query',
		'dojo/dom-class',
		'dojo/dom-attr',
		'src/_FormWidgetBase',
		'dojo/NodeList-traverse'
		], 

function(declare, lang, array, query, domClass, domAttr, _FormWidgetBase){

return declare('Dropdown', [_FormWidgetBase], {

	elementClass: '.element.select',

	items: null,

	selector: null,

	initWidget: function() {
		this._initDropdown();
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