// MultipleChoice
// 
define([
		'dojo/_base/declare',
		'dojo/_base/array',
		'dojo/_base/lang',
		'dojo/on',
		'dojo/json',
		'src/_FormWidgetBase'
		], 

function(declare, array, lang, on, json, _FormWidgetBase){

return declare('MultipleChoice', [_FormWidgetBase], {

//{target:'li_4', status: 'checked', action:'check', param:'all'}

	elementClass: '.element.radio',

	_initEvent: function() {
		array.forEach(this.items, function(item) {
			on(item.domNode, "change", lang.hitch(this, "eventhandler"));
		}, this);

	},

	eventhandler: function(e){
		var t = this._updateStatus(e.target);
		console.log(this.rule);
		var c = this.stringfy(this.rule);
		console.log(c);
		console.log(this.parseRule(c));
	}



});
});