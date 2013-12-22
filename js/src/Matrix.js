// Checkboxes
// 
define([
		'dojo/_base/declare',
		'dojo/_base/array',
		'dojo/query',
		'dojo/dom-class',
		'src/_FormWidgetBase',
		'dojo/NodeList-traverse'
		], 

function(declare, array, query, domClass, _FormWidgetBase){

return declare('Matrix', [_FormWidgetBase], {


	elementClass: '.element.checkbox',

	items: null,

	valueLabels: null,

	caption: '',

	_type: '',

	constructor: function() {
		this.initWidget();
	},

	initWidget: function() {
		//this.inherited(arguments);

		// set caption
		this.caption = this._getCaption();
		// set type
		this._type = this._getType();
		// set Items
		this._getMatrixItmes();
		console.log('item', this.items);


	},

	_getCaption: function() {
		return query('caption', this.domNode)[0].innerText;
	},

	_getType: function() {
		var single = query('input[type=radio]', this.domNode).length > 0 ? 'single' : undefined,
			multi = query('input[type=checkbox]', this.domNode).length > 0 ? 'multi' : undefined;
		return single || multi;
	},

	_getMatrixItmes: function() {
		this.items = [];
		var items = query('tr', this.domNode);
		var anserVauleLine = items.shift();
		this._getValues(anserVauleLine);
		array.forEach(items, function(item) {
			var question = query('td.first_col', item)[0].innerText;
			this.items.push(
				{	
					domNode: item,
					question: question
				}
			);
		}, this);
	},

	_getValues: function(anserVauleLine) {
		var valueLabels = query('th', anserVauleLine);
		valueLabels.shift();
		this.valueLabels = [];
		array.forEach(valueLabels, function(valueLabel) {
			this.valueLabels.push(valueLabel.innerText);
		}, this);
	}





});
});