// Selector.js
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

return declare('Selector', [_FormWidgetBase], {

	items: null,

	selector: null,

	lastSelectedItemId: 0,

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
		this.selector = this.domNode;
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
	},

	filterSelect: function() {
		this.eventhandler = this._filterSelect;
	},

	getFilteredOptionStr: function(selectedItemId){
		var optionsHtml = '';
		array.forEach(this.items, function(option, id) {
			if (selectedItemId !== id) {
				var opstr = ['<option ',
								'value="',
								option.value,
								'">',
								option.label,
								'</option>'].join('');
				optionsHtml += opstr;
			}
		}, this);
		return optionsHtml;
	},

	_filterSelect: function(e) {
		// create the new selection 
		// pass the filtered items into the new selection
		// bind the widet Rule to the new selection
		if (this.items.length  === 2) return;
		var selectedItemId = e.target.selectedIndex,
			sId = domAttr.get(e.target, 'sId');
		if (sId !== null && sId != this.subDropdowns.length) return;
		this.items.splice(selectedItemId, 1);
		var optionsHtml = '';
		array.forEach(this.items, function(option, id) {
			var opstr = ['<option ',
							'value="',
							option.value,
							'">',
							option.label,
							'</option>'].join('');
			optionsHtml += opstr;
		}, this);
		var wrapper = domConstruct.create('div',null, this.domNode, 'last');
		var select = domConstruct.create(
				"select", 
				{
					innerHTML: optionsHtml,
					className: 'element select medium',
					sId: this.subDropdowns.length + 1

				}, 
				wrapper, 'last');
		this.subDropdowns.push(select);

	},

	subDropdowns: [this.domNode],

	initActionMap: function(){
		this.actionMap = {};
		this.actionMap.filterSelect = this.filterSelect;
	}





});
});