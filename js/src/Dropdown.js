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
		'src/Selector',
		'src/Reg',
		'dojo/NodeList-traverse',
		'dojo/NodeList-manipulate'
		], 

function(declare, lang, array, on, query, domAttr, domConstruct, _FormWidgetBase, Selector, Reg){

return declare('Dropdown', [_FormWidgetBase], {

	elementClass: '.element.select',

	items: null,

	selectors: null,

	initWidget: function() {
		this._initDropdown();
	},

	_initEvent: function() {
		on(this.domNode, "change", lang.hitch(this, "eventhandler"));
	},

	saveOrigin: function() {
	},

	eventhandler: function(e){
		this.inherited(arguments);
	},

	_initDropdown: function() {
		var el = query(this.elementClass, this.domNode)[0];
		this.items = [];
		this.items.push( new Selector({el: el}));
		this.originItemLength = this.items[0].items.length;
	},

	addItemLogic: function(){},

	filterSelect: function() {
		this.eventhandler = this._filterSelect;
	},

	_filterSelect: function(e) {
		// if the selection is the first time selection, do the normal action
		// if the selector has been operated, reset rest selectors

		var selectedItemId = e.target.selectedIndex;
		var selector = this._byId(e.target.id);
		console.log('selectedItemId, lastSelectedItemId', selectedItemId);

		this.resetOthers(selector);

		if (this.items.length  === this.originItemLength -1) return;


		var newSelectorInnerHtml = selector.getFilteredOptionStr(selectedItemId);
		var wrapper = domConstruct.create('div',null, this.domNode, 'last');
		var select = domConstruct.create(
				"select", 
				{
					innerHTML: newSelectorInnerHtml,
					className: 'element select medium',
					id: this.eId + '_' + (this.items.length),
				}, 
				wrapper, 'last');

		var nextSelector = new Selector({el: select, wrapper: wrapper});
		this.items.push(nextSelector);
		Reg.add(nextSelector);

	},

	resetOthers: function(selector) {
		var latterIdx = this.items.indexOf(selector),
			idList = [];
		var resetList = array.filter(this.items, function(s, id) {

			if (id > latterIdx ){
				idList.push(id);
				return true;
			}
			return false;
		}, this);


		if (idList.length === 0) return;
		for (var i = idList.length -1; i >=0; i --){
			this.remove(idList[i]);
		}
		array.map(resetList, function(s, i) {
			if (s.wrapper) domConstruct.destroy(s.wrapper);
			Reg.destroy(s.eId);

		}, this);
	},
	disable: function(){},

	remove: function(id) {
		this.items.splice(id, 1);
	},

	initActionMap: function(){
		this.actionMap = {};
		this.actionMap.filterSelect = this.filterSelect;
	}





});
});