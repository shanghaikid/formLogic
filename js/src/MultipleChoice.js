// MultipleChoice
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

return declare('MultipleChoice', [_FormWidgetBase], {

	elementClass: '.element.radio',

	id: '',

	items: [],

	constructor: function() {
		this.initWidget();
	},

	initWidget: function() {
		this.inherited(arguments);
		console.log(this.items);

	}






});
});