// Checkboxes
// 
define([
		'dojo/_base/declare',
		'dojo/_base/array',
		'dojo/query',
		'dojo/dom-class',
		'src/_FormWidgetBase',
		'dojo/NodeList-traverse'
		], 

function(declare, array, query, domClass, _FormWidgetBase){

return declare('Checkboxes', [_FormWidgetBase], {

	elementClass: '.element.checkbox',

	mutex: function(id) {
		var item = this._getItem(id);
		this.uncheckAll();
		this.disableAll();
		this.enable(item);
		this.check(item);
	}






});
});