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
		console.log(el);
		this.items = [];
		this.items.push( new Selector({el: el}));
		this.originItemLength = this.items[0].items.length;
	},

	filterSelect: function() {
		this.eventhandler = this._filterSelect;
	},

	_filterSelect: function(e) {
		// if the selection is the first time selection, do the normal action
		// if the selector has been operated, reset rest selectors
		var selectedItemId = e.target.selectedIndex;
		var selector = this._byId(e.target.id);
		if (selector.lastSelectedItemId) {
			this.resetOthers(selector);
		}

		selector.lastSelectedItemId = selectedItemId;

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

		//console.log('selector items', selectedItemId, newSelectorInnerHtml, nextSelector);

	},

	resetOthers: function(selector) {
		var sId = 0,
			idList =[];
		var resetList = array.filter(this.items, function(s, id) {
			if (s == selector) {
				sId = id;
			}
			if (id>sId){
				idList.push(id);
				return true;
			}
			return id > sId;
		}, this);

		console.log('resetList', this.items, resetList, idList);


		for (var i = 0; i < idList.length; i ++){
			this.remove(idList[i]);
		}
		array.map(resetList, function(s, i) {
			if (s.wrapper) domConstruct.destroy(s.wrapper);
			Reg.destroy(s.eId);

		}, this);
	},

	remove: function(id) {
		console.log('after', id);
		this.items.splice(id, 1);
				console.log('after', this.items);

	},

	initActionMap: function(){
		this.actionMap = {};
		this.actionMap.filterSelect = this.filterSelect;
	}





});
});