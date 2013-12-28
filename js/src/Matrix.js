// Checkboxes
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/query',
		'dojo/on',
		'dojo/dom-class',
		'dojo/dom-attr',
		'src/_FormWidgetBase',
		'src/Checkboxes',
		'src/MultipleChoice',
		'dojo/NodeList-traverse'
		], 

function(declare, lang, array, query, on, domClass, domAttr, _FormWidgetBase, Checkboxes, MultipleChoice){

return declare('Matrix', [_FormWidgetBase], {


	valueLabels: null,

	caption: '',

	_type: '',


	initWidget: function() {
		// set caption
		this.caption = this._getCaption();
		// set type
		this._type = this._getType();
		// set Items
		this._initMatrixItmes();
		this._initColIds();

	},

	eventhandler: function(e){
		this.inherited(arguments);
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
				el: item,
				rule: domAttr.get(item, 'rule') || undefined
			};
			var _item = new lang.getObject(this._type)(params);
			this.items.push(_item);
		}, this);
	},

	_initColIds: function() {
		this.colIds = [];
		for (var i = 0; i< this.valueLabels.length; i++) {
			this.colIds.push(i);
		}
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

	disable: function(id, item) {
		if (id === undefined) {
			this.disableAll();
			return;
		}
		// array.map(this.items, callback) second argument is the index of this.items
		var mId = typeof item === 'number' ? item : id;
		this.items[mId].disableAll();
	},

	disableCol: function(cId) {
		if (cId === undefined) return;
		array.forEach(this.items, function(item, i){
			item.disable(cId);
		}, this);
	},

	enableCol: function(cId) {
		if (cId === undefined) return;
		array.forEach(this.items, function(item, i){
			item.enable(cId);
		}, this);
	},

	checkCol: function(cId) {
		if (cId === undefined) return;
		array.forEach(this.items, function(item, i){
			item.check(cId);
		}, this);
	},

	mutexCol: function(cId) {
		if (cId === undefined) return;
		this.reset();
		this.disable();

		this.enableCol(cId);
		//this.checkCol(cId);
	},

	mutexOption: function() {
		// loop every col
		array.forEach(this.colIds, function(colId){
			// loop every items(row)
			array.forEach(this.items, function(item){
				// the current input
				var thisItem = item.items[colId];
				// when click the input,
				on(thisItem.input, 'click', lang.hitch(this, function(e){
					// uncheck this col
					this.uncheckCol(colId);
					// check the current item
					item.check(thisItem);
				}));
			}, this);
		}, this);
	},

	uncheckCol: function(cId) {
		if (cId === undefined) return;
		array.forEach(this.items, function(item, i){
			item.uncheck(cId);
		}, this);
	},

	contain: function(rule) {
		//1>0
		var cols = rule.split('>'),
			len = cols.length,
			smallest = cols[len - 1]*1,
			biggest = cols[0]*1;

		array.forEach(cols, function(col, i){
			var colId = col*1;
			// disable all col checkboxes
			this.disableCol(colId);
			// if current col is the first col, 
			if (colId < biggest) {

				array.forEach(this.items, function(row){
					var nextColId = colId + 1,
						nextItem = row.items[nextColId],
						thisItem = row.items[colId];
					// if exist next Col, bind the click event
					if (nextItem) {
						on(row.items[colId].input, 'click', function(e){

								array.forEach(cols, function(col){
									var _colId = col*1;
									// if this input is checked, when click it, means uncheck it, reset and disable all other cols which bigger than this col
									if (thisItem.checked) {
										if ( _colId > colId) {
											row.reset(_colId);
											row.disable(_colId); 
										}
									// if this input is unchecked, check it. reset all other cols
									} else {
										if ( _colId >= nextColId) {
											row.reset(_colId); 
										}
									}
								}, this);


						});
					}
				}, this);
			}
		}, this);

		this.enableCol(smallest);

		//console.log('contain', rule);
	},

	compare: function(rule) {
		// rows
		var rows = this.items;
		// loop each row
		array.forEach(rows, function(row, i) {
			// get next row
			var nextRow = this.items[i+1];
			// if exist next row
			if (nextRow) {
				// loop current row items
				array.forEach(row.items, function(input, colId) {
					// if click current input, 
					on(input.input, 'click', function(e) {
						// get current colId, calculate number of Item should be enable for the next row
						var numberOfEnable = colId + 1;
						// enable the next row for the given numbers of items
						nextRow.enableItems(numberOfEnable);
					});

				}, this);
			}
		}, this);
		//console.log('compare', rule);
	},

	initActionMap: function(){
		this.actionMap = {};
		this.actionMap.checkCol = this.checkCol;
		this.actionMap.uncheckCol = this.uncheckCol;
		this.actionMap.disableCol = this.disableCol;
		this.actionMap.enableCol = this.enableCol;
		this.actionMap.mutexCol = this.mutexCol;
		this.actionMap.contain = this.contain;
		this.actionMap.mutexOption = this.mutexOption;
		this.actionMap.compare = this.compare;

	},




});
});