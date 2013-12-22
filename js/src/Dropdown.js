// Checkboxes
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/query',
		'dojo/dom-class',
		'src/_FormWidgetBase',
		'dojo/NodeList-traverse'
		], 

function(declare, lang, array, query, domClass, _FormWidgetBase){

return declare('Dropdown', [_FormWidgetBase], {

	elementClass: '.element.select',

	items: null,

	constructor: function() {
		this.initWidget();
	},

	initWidget: function() {
		//this.inherited(arguments);
		this._initDropdown();
		console.log('item', this.items);


	},

	_initOptions: function() {

	}




});
});