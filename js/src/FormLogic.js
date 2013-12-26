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
		'src/Reg',
		'src/_Rule',
		'dojo/NodeList-traverse'
		], 
function(declare, lang, array, query, aspect, domClass,
		_BaseClass, MultipleChoice, Checkboxes, Matrix, Dropdown, Reg, _Rule){

return declare([_BaseClass, _Rule], {

	config: {
		query: ['li.checkboxes', 'li.matrix', 'li.multiple_choice', 'li.dropdown'],
		widgetClass: [Checkboxes, Matrix, MultipleChoice, Dropdown]

	},

	constructor: function() {
		formLogic = this;
		formLogic._Rule = _Rule;
		formLogic.Reg = Reg;
		// get elments to init widgets
		this.initFormWidget();

	},

	initFormWidget: function() {
		array.forEach(this.config.query, function(q, i) {
			var formInputs = query(q, this.domNode);
			array.forEach(formInputs, function(formInput) {
				Reg.add(new this.config.widgetClass[i]({el: formInput}));
			}, this);
		}, this);
		//console.log('initFormWidget');
	}




});
});