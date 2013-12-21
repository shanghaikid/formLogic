// _FormWidgetBase
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/query',
		'dojo/dom-class',
		'dojo/NodeList-traverse'
		], 
function(declare, lang, array, query, domClass){

return declare(null, {

	// widget dom node ref
	domNode: null,

	// widget description	
	description: '',

	// id
	id: '',

	elementClass: '',

	// init in widget class
	items: null,

	originItems: null,

	constructor: function(el) {
		console.log('_FormWidgetBase start init');
		this.domNode = this.getDomNode(el);
		//this.initWidget(); //call initWidget in widget class's constructor
	},

	getDomNode: function(el) {
		return query(el)[0];
	},

	_getId: function() {
		return query(this.domNode)[0].id;
	},

	initWidget: function() {
		// common init
		this.id = this._getId();
		// get items
		var items = query(this.elementClass, this.domNode);
		array.forEach(items, function(item, i) {
			var q = query(item),
				label = q.next()[0].innerHTML,
				v = item.value,
				disabled = item.disabled,
				checked = item.checked,
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
					id: i

				}
			);

		}, this);
		this.originItems = lang.clone(this.items);
	},

	// todo: needs refine
	reset: function(id) {
		if (id === undefined) {
			this._resetAll();
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

	_resetAll: function() {
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
			this._showAll();
			return;
		}
		var item = this._getItem(id);
		domClass.remove(item.domNode, 'hidden');
	},

	_showAll: function() {
		array.map(this.items, this.show, this);
	},

	_hideAll: function() {
		array.map(this.items, this.hide, this);
	},

	hide: function(id) {
		if (id === undefined) {
			this._hideAll();
			return;
		}
		var item = this._getItem(id);
		domClass.add(item.domNode, 'hidden');
		item.disabled = true;
	},

	enable: function(id) {
		if (id === undefined) {
			this._enableAll();
			return;
		}
		var item = this._getItem(id);
		item.input.disabled = false;
		domClass.remove(item.domNode, 'disabled');
		item.disabled = false;
	},

	disable: function(id) {
		if (id === undefined) {
			this._disableAll();
			return;
		}
		var item = this._getItem(id);
		item.input.disabled = true;
		domClass.add(item.domNode, 'disabled');
		item.disabled = true;
	},

	_enableAll: function() {
		array.map(this.items, this.enable, this);
	},

	_disableAll: function() {
		array.map(this.items, this.disable, this);
	},

	check: function(id) {
		if (id === undefined) return;
		var item = this._getItem(id);
		if (item.disabled) return;
		item.input.checked = true;
	},

	uncheck: function(id) {
		var item = this._getItem(id);
		item.input.checked = false;
	},

	_checkAll: function() {
		array.map(this.items, this.check, this);
	},

	_uncheckAll: function() {
		array.map(this.items, this.uncheck, this);
	}



});
});