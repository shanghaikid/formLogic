// _FormWidgetBase
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/query',
		'dojo/aspect',
		'dojo/dom-class',
		'src/_BaseClass',
		'src/MultipleChoice',
		'src/Checkboxes',
		'src/Matrix',
		'src/Dropdown',
		'dojo/NodeList-traverse'
		], 
function(declare, lang, array, query, aspect, domClass,
		_BaseClass, MultipleChoice, Checkboxes, Matrix, Dropdown){

return declare([_BaseClass], {

	constructor: function() {

		// get elments to init widgets
		this.initFormWidget();
		// parse widgets rules
		this.parseWidgetRule();
		// connect widgets
		this.connectWidgets();

	},

	initFormWidget: function() {
		console.log('initFormWidget');
	},

	parseWidgetRule: function() {
		console.log('parseWidgetRule');
	},

	connectWidgets: function() {
		console.log('connectWidgets');
	}




});
});