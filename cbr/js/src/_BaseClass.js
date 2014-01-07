// _Base.js
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/query',
		'dojo/NodeList-traverse'
		], 
function(declare, lang, query){

return declare(null, {

	// widget dom node ref
	domNode: null,

	constructor: function(kwArgs) {
		// mixin arguments object with this
		lang.mixin(this, kwArgs);

		this.initDomNode();

	},

	_getDomNode: function(el) {
		return query(el)[0];
	},

	initDomNode: function() {
		// init domNode
		this.domNode = this._getDomNode(this.el);
		// element Id
		this.eId = query(this.domNode)[0].id;
	}



});
});