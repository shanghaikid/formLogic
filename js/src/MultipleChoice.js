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

//{target:'li_4', status: 'checked', compare:'', action:'check', param:'all'}

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