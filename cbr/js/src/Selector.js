// Selector.js
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/on',
		'dojo/json',
		'dojo/query',
		'dojo/dom-attr',
		'dojo/dom-construct',
		'src/_FormWidgetBase',
		'dojo/NodeList-traverse',
		'dojo/NodeList-manipulate'
		], 

function(declare, lang, array, on, json, query, domAttr, domConstruct, _FormWidgetBase){

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

	disable: function() {
		//domAttr.set(this.selector, 'disabled', true);
	},


	eventhandler: function(e){
		this.inherited(arguments);
	},


	_initDropdown: function() {
		this.selector = this.domNode;
		this.items = [];
		array.forEach(this.selector.options, function(item, i){
			var rule = json.parse(domAttr.get(item, 'rule') || null );

			this.items.push({
				domNode: item,
				id: i,
				value: item.value,
				oValue: item.value,
				label: item.innerText,
				rule: rule,
				eId: this.domNode.id,
				parent: this.parent
			});
		}, this);
	},

	_filtered: [],

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
	}

});
});