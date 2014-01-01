// _FormWidgetBase
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/query',
		'dojo/on',
		'dojo/aspect',
		'dojo/dom-class',
		'dojo/dom-construct',

		'src/_BaseClass',
		'src/MultipleChoice',
		'src/Checkboxes',
		'src/Matrix',
		'src/Dropdown',
		'src/Reg',
		'src/_Rule',
		'dojo/NodeList-traverse'
		], 
function(declare, lang, array, query, on, aspect, domClass, domConstruct,
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
		// if (this.addLogic) {
		//	this.initLogicPanel();
		// } else {
			this.initFormWidget();
		//}

	},

	initLogicPanel: function() {
		// this._buildButton();
		// this._bindPanel();
	},

	_buildButton: function() {
		array.forEach(query('label.description', this.domNode), function(label){
			var wrapper = domConstruct.create('span',{ innerHTML: "<button>添加问题规则</button>", class:'addQuestionRule' }, label, 'after');
		}, this);

		array.forEach(query('li.checkboxes label.choice', this.domNode), function(label){
			var wrapper = domConstruct.create('div',{ innerHTML: "<button>添加选项规则</button>", class:'addRule' }, label, 'after');
		}, this);

		array.forEach(query('li.multiple_choice label.choice', this.domNode), function(label){
			var wrapper = domConstruct.create('div',{ innerHTML: "<button>添加选项规则</button>", class:'addRule' }, label, 'after');
		}, this);
	},

	_bindPanel: function() {
		on(query('label.description'), 'mouseover', function(e) {
			var question = e.target;

		});
	},

	initFormWidget: function() {
		array.forEach(this.config.query, function(q, i) {
			var formInputs = query(q, this.domNode);
			array.forEach(formInputs, function(formInput) {
				Reg.add(new this.config.widgetClass[i]({el: formInput, addLogic: this.addLogic}));
			}, this);
		}, this);
		//console.log('initFormWidget');
	}




});
});