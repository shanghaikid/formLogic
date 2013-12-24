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
		'dojo/on',
		'src/_Rule',
		'src/_BaseClass',
		'dojo/NodeList-traverse'
		], 
function(declare, lang, array, query, aspect, domClass, domAttr, on, _Rule, _BaseClass){

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

	//

	constructor: function() {

		// init items;
		this.items = [];
		this.initWidget();
		this.saveOrigin();
		this.initWidgetRule();
		this._initEvent();

	},

	_initEvent: function() {},

	eventhandler: function(e){
	},

	_updateStatus: function(item) {
		var savedItem =  this._byId(item.id);
		savedItem.checked = item.checked;
		savedItem.disabled = item.disabled;
		return savedItem; 
	},

	_byId: function(id) {
		var item = array.filter(this.items, function(item) {
			return item.eId == id;
		});
		return item[0];
	},

	saveOrigin: function() {
		this.originItems = lang.clone(this.items);
	},

	_getDomNode: function(el) {
		return query(el)[0];
	},

	initWidget: function() {

		console.log('query', this.elementClass);
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

	initWidgetRule: function(){
		this.rule = this.parseRule (domAttr.get(this.domNode, 'rule') || null);
	},

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

		show ? this.show(item) : this.hide(item);
		disabled ? this.disable(item) : this.enable(item);
		checked ? this.check(item) : this.uncheck(item);
		
	},

	resetAll: function() {
		array.map(this.items, this.reset, this);
	},

	get: function(id, attr) {
		return attr && this.items[id][attr] ? this.items[id][attr] : this.items[id];
	},

	_getItem: function(id) {
		return typeof id === 'number' ? this.items[id] : id;
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
		if (id === undefined) return;
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
	}



});
});