// _FormWidgetBase
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/query',
		'dojo/dom-attr',
		'dojo/json',

		'src/_BaseClass',
		'src/RulesConfig',
		'src/Reg',
		'src/_Rule',
		'dojo/NodeList-traverse'
		], 
function(declare, lang, array, query, domAttr, json,
		_BaseClass, RulesConfig, Reg, _Rule){

return declare([_BaseClass, _Rule], {


	constructor: function() {
		formLogic = this;
		formLogic._Rule = _Rule;
		formLogic.Reg = Reg;
		this.initLogicData();
		this.initFormWidget();

	},

	initLogicData: function(){
		if (this.logicData ===''){
			Reg.data = {};
			return;
		}
		var data = Reg.data = json.parse(this.logicData);
		for (var i in data) {
			var node = query('#'+i, this.domNode)[0];
			if(node) {
				domAttr.set(node, 'rule', this.stringfy(data[i]));
			}
		}
	},

	initFormWidget: function() {
		array.forEach(RulesConfig.config.query, function(q, i) {
			var formInputs = query(q, this.domNode);
			array.forEach(formInputs, function(formInput) {
				Reg.add(new RulesConfig.config.widgetClass[i]({el: formInput, logicData:this.logicData, addLogic: this.addLogic, page: this.domNode}));
			}, this);
		}, this);
		//console.log('initFormWidget');
	}




});
});