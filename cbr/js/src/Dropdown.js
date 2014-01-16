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

	selectors: null,

	items: null,

	initWidget: function() {
		this._initDropdown();
	},

	addItemLogic: function() {
		//
		array.forEach(this.items, function(item,i) {
			if (i>0) {
				var div = domConstruct.create('div', {'class': 'labelWrapper'}, this.domNode, 'last');
				var label = domConstruct.create('label', {'class': 'choice', innerHTML: item.label}, div, 'last');
				if (item.rule && item.rule.length > 0) {
					array.forEach(item.rule, function(r){
						this.createItemRemoveRuleButton(label, item, r);
					}, this);
				}
				this.createItemRuleButton(label, item);
			}
		}, this);
	},

	_initEvent: function() {
		on(this.domNode, "change", lang.hitch(this, "eventhandler"));
	},

	saveOrigin: function() {
	},

	eventhandler: function(e){
		this.inherited(arguments);
	},

	_updateStatus: function(target){
		return this.items[target.selectedIndex];
	},

	_initDropdown: function() {
		var el = query(this.elementClass, this.domNode)[0];
		this.selectors = [];
		this.selectors.push( Reg.add(new Selector({el: el, parent: this})));
		this.items = this.selectors[0].items;
		this.originSelectorLength = this.selectors[0].items.length;
	},

	filterSelect: function() {
		this.eventhandler = this._filterSelect;
	},

	_filterSelect: function(e) {
		// if the selection is the first time selection, do the normal action
		// if the selector has been operated, reset rest selectors

		var selectedItemId = e.target.selectedIndex;
		var selector = this._byId(e.target.id, this.selectors);
		this.resetOthers(selector);

		if (this.selectors.length  === this.originSelectorLength -1) {
			this._setValue();
			return;
		}

		// set the vavlue
		this._setValue();

		var newSelectorInnerHtml = selector.getFilteredOptionStr(selectedItemId);
		var wrapper = domConstruct.create('div',null, this.domNode, 'last');
		var select = domConstruct.create(
				"select", 
				{
					innerHTML: newSelectorInnerHtml,
					className: 'element select medium',
					id: this.eId + '_' + (this.selectors.length),
				}, 
				wrapper, 'last');

		var nextSelector = new Selector({el: select, wrapper: wrapper});
		this.selectors.push(nextSelector);
		Reg.add(nextSelector);

	},

	_setValue: function() {
		var res = '';
		array.forEach(this.selectors, function(s, i){
			var v = s.items[s.domNode.selectedIndex].oValue;
			if(v !== '') {
				res += v;
			}
		});

		var a = this.selectors[0].domNode.options[this.selectors[0].domNode.selectedIndex];
		a.value = res;
		console.log(res, a.value);
	},

	resetOthers: function(selector) {
		var latterIdx = this.selectors.indexOf(selector),
			idList = [];
		var resetList = array.filter(this.selectors, function(s, id) {

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
	disable: function(){
		this.selectors[0].disable();
	},

	remove: function(id) {
		this.selectors.splice(id, 1);
	},

	enableOption: function(id) {
		domAttr.set(this.items[id].domNode, 'disabled' , false );
	},

	disableOption: function(id){
		domAttr.set(this.items[id].domNode, 'disabled' , true );
		console.log('select, hide, d');
	},

	initActionMap: function(){
		this.actionMap = {};
		this.actionMap.enableOption = this.enableOption;
		this.actionMap.disableOption = this.disableOption;
		this.actionMap.appear = this.appear;
		this.actionMap.disappear = this.disappear;
		this.actionMap.disable = this.disappear;
		this.actionMap.submit = this.submit;
		this.actionMap.redirect = this.redirect;
		this.actionMap.filterSelect = this.filterSelect;
	},

	_initActions: function() {
		this.actions =  [
			{label: '禁用选项', action: 'disableOption'},
			{label: '启用选项', action: 'enableOption'},
			{label: '显示题目', action: 'appear',  noNeedItem: true},
			{label: '隐藏题目', action: 'disappear', widgetAction: true, itemAction:true, noNeedItem: true},
			{label: '跳转链接', action: 'redirect',selfAction:true ,noNeedItem: true, newParam: 'input'},
			{label: '提交表单', action: 'submit', selfAction:true,  noNeedItem: true},
			{label: '排序过滤', action: 'filterSelect', widgetAction:true, noNeedItem: true}
		];
	}

});
});