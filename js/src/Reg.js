// _FormWidgetBase
// 
define([
		'dojo/_base/declare',
		'dojo/dom-construct',
		'src/_BaseClass'
		], 
function(declare, domConstruct, _BaseClass){

return {

	_w: {},

	//add widget,

	add: function(widget) {
		this._w[widget.eId] = widget;
	},

	byId: function(id) {
		return this._w[id] || null;
	},

	destroy: function(id) {
		var item = this.byId(id);
		if(item) {
			domConstruct.destroy(item.domNode);
			delete this._w[id];
		}
	}

};
});