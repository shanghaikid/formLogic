// Checkboxes
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/query',
		'dojo/dom-class',
		'src/_FormWidgetBase',
		'src/Checkboxes',
		'src/MultipleChoice',
		'dojo/NodeList-traverse'
		], 

function(declare, lang, array, query, domClass, _FormWidgetBase, Checkboxes, MultipleChoice){

return declare('Matrix', [_FormWidgetBase], {


	valueLabels: null,

	caption: '',

	_type: '',


	initWidget: function() {
		//this.inherited(arguments);
		console.log('this.el', this.el);
		// set caption
		this.caption = this._getCaption();
		// set type
		this._type = this._getType();
		// set Items
		this._initMatrixItmes();

	},

	_getCaption: function() {
		return query('caption', this.domNode)[0].innerText;
	},

	_getType: function() {
		var single = query('input[type=radio]', this.domNode).length > 0 ? 'MultipleChoice' : undefined,
			multi = query('input[type=checkbox]', this.domNode).length > 0 ? 'Checkboxes' : undefined;
		return single || multi;
	},

	_params: {
		'MultipleChoice': 'input[type=radio]',
		'Checkboxes': 'input[type=checkbox]'
	},

	_initMatrixItmes: function() {
		this.items = [];
		var items = query('tr', this.domNode);
		this._getValuesLabels(items.shift());


		// get Items
		array.forEach(items, function(item) {
			var question = query('td.first_col', item)[0].innerText;
			//set param
			var params = {
				elementClass: this._params[this._type],
				labels: this.valueLabels,
				el: item
			};
			var _item = new lang.getObject(this._type)(params);
			this.items.push(_item);
		}, this);
	},

	// no origin needed for matrix
	saveOrigin: function(){},

	_getValuesLabels: function(anserVauleLine) {
		var valueLabels = query('th', anserVauleLine);
		valueLabels.shift();
		this.valueLabels = [];
		array.forEach(valueLabels, function(valueLabel) {
			this.valueLabels.push(valueLabel.innerText);
		}, this);
	},

	// check every question
	check: function(id) {
		this.items[id].checkAll();
	},

	// uncheck every question
	uncheck: function(id) {
		this.items[id].uncheckAll();
	},

	reset: function(id, item) {
		if (id === undefined) {
			this.resetAll();
			return;
		}
		// array.map(this.items, callback) second argument is the index of this.items
		var mId = typeof item === 'number' ? item : id;
		this.items[mId].resetAll();
	},

	resetAll: function() {
		array.map(this.items, this.reset, this);
	}




});
});