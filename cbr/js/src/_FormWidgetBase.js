// _FormWidgetBase
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/query',
		'dojo/aspect',
		'dojo/dom-class',
		'dojo/dom-attr',
		'dojo/dom-style',
		'dojo/dom-construct',
		'dojo/dom',
		'dojo/on',
		'src/_Rule',
		'src/Reg',
		'src/_BaseClass',
		'dojo/NodeList-traverse'
		], 
function(declare, lang, array, query, aspect, domClass, domAttr, domStyle,domConstruct, dom, on, _Rule, Reg, _BaseClass){

return declare([_BaseClass, _Rule], {

	// widget description
	description: '',

	// id
	eId: '',

	elementClass: '',

	// init in widget class
	items: null,

	originItems: null,

	//widget Rule
	rule: null,

	// rule action list
	actionMap: null,

	constructor: function() {

		// init items;
		this.items = [];
		// init widget
		this.initWidget();
		// clone originate items
		this.saveOrigin();
		// initialize rule action list
		this.initActionMap();
		// parse widget rule
		this.initWidgetRule();
		// bind default event to inputs inside the widget
		this._initEvent();

		if (this.addLogic) {
			this.disable();
			this.rulesDef =  this._initRuleDefinition();
			this._initActions();
			this._addLogic();
		} 

	},

	_addLogic: function() {
		var captionNode = this._getCaption();
		if(captionNode) {
			if (this.rule) {
				this.createWidgetRemoveRuleButton(captionNode);
			} else {
				this.createWidgetLogicButton(captionNode); 
			}
		}
		this.addItemLogic();
	},

	addItemLogic: function(){
		array.forEach(this.items, function(item, i) {
			var labels = query('label.choice', this.domNode);
			if (item.rule) {
				this.createItemRemoveRuleButton(labels[i], item);
			} else {
				this.createItemRuleButton(labels[i], item);
			}
		}, this);
	},

	initActionMap: function(){
		this.actionMap = {};
		// default action maps. you can add yourselfs in the single widget definition
		array.forEach(
			['check', 
				'uncheck', 'show', 'hide', 'disable', 
				'reset', 'enable', 'submit', 'redirect', 
				'disappear','appear'], function(action){
			this.actionMap[action] = this[action];
		}, this);

	},

	// just an interface
	_initEvent: function() {},

	// get rule target object
	_getTarget: function(rule){
		if (rule === null) return rule;
		return rule.target === 'self' ? this : Reg.byId(rule.target);
	},

	// default event handler for inputs inside the widget
	eventhandler: function(e){
		// current target
		var t = this._updateStatus(e.target);
		if (!t) return;
		//console.log('target is', e,t);
		if (t.rule) this.execute(t.rule, e);
	},

	// when event happened, update item's status, return the item.
	_updateStatus: function(item) {
		var savedItem =  this._byId(item.id);
		if (!savedItem) return undefined;
		savedItem.checked = item.checked;
		savedItem.disabled = item.disabled;
		return savedItem; 
	},

	// find the item object by dom id
	_byId: function(id) {
		var item = array.filter(this.items, function(item) {
			return item.eId == id;
		});
		return item[0];
	},

	// clone origin items
	saveOrigin: function() {
		this.originItems = lang.clone(this.items);
	},

	// return widget domNode
	_getDomNode: function(el) {
		return query(el)[0];
	},

	// initialize widget
	initWidget: function() {

		//console.log('query', this.elementClass);
		// get items
		var items = query(this.elementClass, this.domNode);
		array.forEach(items, function(item, i) {
			var q = query(item),
				label = this.labels && this.labels[i] || q.next()[0].innerHTML,
				v = item.value,
				disabled = item.disabled,
				checked = item.checked,
				eId = item.id,
				rule = this.parseRule( domAttr.get(item, 'rule') || null );
				parent = q.parent()[0];
			this.items.push(
				{
					domNode : parent,
					label: label,
					value: v,
					input: item,
					show: true,
					disabled: disabled,
					mutex: false,
					checked: checked,
					id: i,
					eId: eId,
					rule :rule
				}
			);
		}, this);
	},

	_getCaption: function() {
		return query('label.description', this.domNode)[0];
	},

	setCaption: function(label) {
		var cap = this._getCaption();
		cap.innerText =  label;
	},

	// parse widget rule, not item rule
	initWidgetRule: function(){
		this.rule = this.parseRule (domAttr.get(this.domNode, 'rule') || null);
		if (this.rule) this.execute(this.rule, undefined, true);

	},

	// Useful method for each widgets

	// todo: needs refine
	reset: function(id) {
		if (id === undefined) {
			this.resetAll();
			return;
		}
		var oitem = this._getOriginItem(id),
			item = this._getItem(id),
			show = oitem.show,
			disabled = oitem.disabled,
			checked = oitem.checked;

		if (show) this.show(item); 
			else this.hide(item);
		if (disabled) this.disable(item);
			else this.enable(item);
		if (checked) this.check(item);
			else this.uncheck(item);

	},

	resetAll: function() {
		array.map(this.items, this.reset, this);
	},

	_getItemStatus: function(item) {
		return item[this.defaultStatusKey];
	},

	_getItem: function(id) {
		if (typeof id === 'object') return id;
		if (typeof id === 'string') return this.items[id*1];
		if (typeof id === 'number') return this.items[id];
	},

	_getOriginItem: function(id) {
		return this.originItems[typeof id === 'number' ? id : id.id];
	},

	show: function(id) {
		if (id === undefined) {
			this.showAll();
			return;
		}
		var item = this._getItem(id);
		domClass.remove(item.domNode, 'hidden');
		item.show = true;
	},

	showAll: function() {
		array.map(this.items, this.show, this);
	},

	hideAll: function() {
		array.map(this.items, this.hide, this);
	},

	hide: function(id) {
		if (id === undefined) {
			this.hideAll();
			return;
		}
		var item = this._getItem(id);
		domClass.add(item.domNode, 'hidden');
		item.show = false;
	},

	enable: function(id) {
		if (id === undefined) {
			this.enableAll();
			return;
		}
		var item = this._getItem(id);
		item.input.disabled = false;
		domClass.remove(item.domNode, 'disabled');
		item.disabled = false;
	},

	disable: function(id) {
		if (id === undefined) {
			this.disableAll();
			return;
		}
		var item = this._getItem(id);
		item.input.disabled = true;
		domClass.add(item.domNode, 'disabled');
		item.disabled = true;
	},

	enableAll: function() {
		array.map(this.items, this.enable, this);
	},

	disableAll: function() {
		array.map(this.items, this.disable, this);
	},

	check: function(id) {
		if (id === undefined) {
			this.checkAll();
			return;
		}
		var item = this._getItem(id);
		if (item.disabled) return;
		item.input.checked = true;
	},

	uncheck: function(id) {
		if (id === undefined) return;
		var item = this._getItem(id);
		item.input.checked = false;
	},

	checkAll: function() {
		array.map(this.items, this.check, this);
	},

	uncheckAll: function() {
		array.map(this.items, this.uncheck, this);
	},

	submit: function() {
		var form = query('form')[0];
		if (form) form.submit();
	},

	redirect: function(url){
		var u = url.replace("@", ":");
		window.location.href = u;
	},

	enableItems: function(number) {
		// enable how many inputs(number)
		if (typeof number !== 'number' && number < 0) return;
		this.reset();
		this.disable();
		for (var i = 0; i < number; i++) {
			this.enable(i);
		}
	},

	disappear: function() {
		domStyle.set(this.domNode, 'display', 'none');
		console.log('ya, disappear');
	},

	appear: function(){
		domStyle.set(this.domNode, 'display', 'block');
		console.log('ya, come on');
	},

	_initActions: function() {
		this.actions =  [
			{label: '选中选项', action: 'check'},
			{label: '取消选中选项', action: 'uncheck'},
			{label: '显示选项', action: 'show'},
			{label: '隐藏选项', action: 'hide'},
			{label: '禁用选项', action: 'disable'},
			{label: '启用选项', action: 'enable'},
			{label: '显示题目', action: 'appear',  noNeedItem: true},
			{label: '隐藏题目', action: 'disappear', widgetAction: true, itemAction:true, noNeedItem: true},
			{label: '跳转链接', action: 'redirect',noNeedItem: true, newParam: 'input'},
			{label: '提交表单', action: 'submit',  noNeedItem: true}
		];
	}



});
});