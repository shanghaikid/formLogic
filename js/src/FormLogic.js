// _FormWidgetBase
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/query',

		'src/_BaseClass',
		'src/RulesConfig',
		'src/Reg',
		'src/_Rule',
		'dojo/NodeList-traverse'
		], 
function(declare, lang, array, query,
		_BaseClass, RulesConfig, Reg, _Rule){

return declare([_BaseClass, _Rule], {


	constructor: function() {
		formLogic = this;
		formLogic._Rule = _Rule;
		formLogic.Reg = Reg;
		this.initFormWidget();

	},

	initFormWidget: function() {
		array.forEach(RulesConfig.config.query, function(q, i) {
			var formInputs = query(q, this.domNode);
			array.forEach(formInputs, function(formInput) {
				Reg.add(new RulesConfig.config.widgetClass[i]({el: formInput, addLogic: this.addLogic, page: this.domNode}));
			}, this);
		}, this);
		//console.log('initFormWidget');
	}




});
});