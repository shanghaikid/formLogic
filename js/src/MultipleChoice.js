// MultipleChoice
// 
define([
		'dojo/_base/declare',
		'dojo/_base/array',
		'dojo/_base/lang',
		'dojo/on',
		'src/_FormWidgetBase'
		], 

function(declare, array, lang, on, _FormWidgetBase){

return declare('MultipleChoice', [_FormWidgetBase], {

	elementClass: '.element.radio',

	_initEvent: function() {
		array.forEach(this.items, function(item) {
			on(item.domNode, "change", lang.hitch(this, "eventhandler"));
		}, this);

	},

		eventhandler: function(e){
		this.inherited(arguments);
	}



});
});