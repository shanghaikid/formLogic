// Dropdown.js
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/on',
		'dojo/query',
		'dojo/dom-attr',
		'dojo/dom-construct',
		'src/_FormWidgetBase',
		'dojo/NodeList-traverse',
		'dojo/NodeList-manipulate'
		], 

function(declare, lang, array, on, query, domAttr, domConstruct, _FormWidgetBase){

return declare('Dropdown', [_FormWidgetBase], {

	elementClass: '.element.select',

	items: null,

	selector: null,

	initWidget: function() {
		this._initDropdown();
	},

	_initEvent: function() {
		on(this.domNode, "change", lang.hitch(this, "eventhandler"));
	},

	saveOrigin: function() {
		this.originItems = query(this.selector).clone()[0];
	},

	reset: function(id) {
		var filteredItem = this._getFilterdItem(id);
		if (filteredItem === undefined) return;
		var first = query(this.items[id - 1].domNode)[0];
		query(filteredItem.domNode).insertAfter(first);
		this.items[id] = filteredItem;
		this.items[id].domNode.innerHTML = this.items[id].label;

	},

	_getFilterdItem: function(id){
		var filteredItem = array.filter(this._filtered, function(item ,i){
			if (item.id == id ) {
				var c = lang.clone(item);
				this._filtered.splice(i, 1);
				return c;
			}
		}, this);
		return filteredItem[0];
	},


	eventhandler: function(e){
		this.inherited(arguments);
	},

	_initDropdown: function() {
		this.selector = query(this.elementClass, this.domNode)[0];
		this.items = [];
		array.forEach(this.selector.options, function(item, i){
			this.items.push({
				domNode: item,
				id: i,
				value: item.value,
				label: item.innerText,
				rule: domAttr.get(item, 'rule')
			});
		}, this);
	},

	remove: function(id) {
		var c = this.items.splice(id, 1);
		this._filtered.push(c[0]);
	},

	_filtered: [],

	filter: function(id) {
		if (id <= 0) return;
		domConstruct.destroy(this.items[id].domNode);
		this.remove(id);
	}





});
});