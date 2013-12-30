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

	_addLogic: function(){
		this.inherited(arguments);
		array.forEach(query('label.choice', this.domNode), function(item){
			var questionButton = domConstruct.create('div',{ innerHTML: "<button>添加选项规则</button>", class:'addRule' }, item, 'after');
			on(questionButton, 'click', lang.hitch(this, function(e){
				console.log('this', this);
				e.preventDefault();
			}));
		}, this);
	},

	defaultStatusKey: 'checked',

	defaultStatusValue: true,

	initActionMap: function(){
		this.inherited(arguments);
		this.actionMap.mutex = this.mutex;
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