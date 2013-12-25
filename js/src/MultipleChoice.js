// MultipleChoice
// 
define([
		'dojo/_base/declare',
		'dojo/_base/array',
		'dojo/_base/lang',
		'dojo/dom',
		'dojo/on',
		'src/_FormWidgetBase',
		'src/Reg'
		], 

function(declare, array, lang, dom, on, _FormWidgetBase, Reg){

return declare('MultipleChoice', [_FormWidgetBase], {

//{target:'li_4', status: 'checked', action:'check', param:'all'}

	elementClass: '.element.radio',

	_initEvent: function() {
		array.forEach(this.items, function(item) {
			on(item.domNode, "change", lang.hitch(this, "eventhandler"));
		}, this);

	},

	eventhandler: function(e){
		// current target
		var t = this._updateStatus(e.target);
		// widget rule target
		var widgetTargetItem = this._getTarget(this.rule);
		var optionTargetItem = this._getTarget(t.rule);
		this._verify(this.rule);
		console.log(widgetTargetItem, optionTargetItem);
	}

});
});