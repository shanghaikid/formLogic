// MultipleChoice
// 
define([
		'dojo/_base/declare',
		'dojo/_base/array',
		'dojo/_base/lang',
		'dojo/query',
		'dojo/dom',
		'dojo/dom-construct',
		'dojo/on',
		'src/_FormWidgetBase',
		'src/Reg'
		], 

function(declare, array, lang, query, dom, domConstruct, on, _FormWidgetBase, Reg){

return declare('MultipleChoice', [_FormWidgetBase], {

//{target:'li_4', status: 'checked', compare:'', action:'check', param:'all'}

	elementClass: '.element.radio',

	_initEvent: function() {
		array.forEach(this.items, function(item) {
			on(item.domNode, "change", lang.hitch(this, "eventhandler"));
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

	initActionMap: function(){
		this.inherited(arguments);
	},

	defaultStatusKey: 'checked',

	defaultStatusValue: true,

	eventhandler: function(e){
		this.inherited(arguments);
	}

});
});