// _FormWidgetBase
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/query',
		'dojo/aspect',
		'src/_BaseClass'
		], 
function(declare, lang, array, query, aspect,
		_BaseClass){

return {

	_w: {},

	//add widget,

	add: function(widget) {
		this._w[widget.eId] = widget;
	},

	byId: function(id) {
		return this._w[id] || null;
	}

};
});