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



	config: {
		query: ['li.checkboxes', 'li.matrix', 'li.multiple_choice', 'li.dropdown'],
		savedIn: ['checkboxes', 'matrixes', 'multipleChoices', 'dropdowns'],
		widgetClass: [Checkboxes, Matrix, MultipleChoice, Dropdown]

	},

	checkboxes: null,

	matrixes: null,

	multipleChoices: null,

	dropdowns: null,

	constructor: function() {

		// init a
		this.checkboxes = [];
		this.matrixes = [];
		this.multipleChoices = [];
		this.dropdowns = [];

		// get elments to init widgets
		this.initFormWidget();
		// parse widgets rules
		this.parseWidgetRule();
		// connect widgets
		this.connectWidgets();

	},

	initFormWidget: function() {
		array.forEach(this.config.query, function(q, i) {
			var formInputs = query(q, this.domNode);
			array.forEach(formInputs, function(formInput) {
				this[this.config.savedIn[i]].push( new this.config.widgetClass[i]({el: formInput}) );
			}, this);
		}, this);
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