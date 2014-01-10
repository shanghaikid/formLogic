// OptionPanel.js
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/query',
		'dojo/on',
		'dojo/dom-attr',
		'dojo/dom-style',
		'dojo/dom-construct',
		"dojo/_base/xhr",
		'dojo/json',

		'dijit/_WidgetBase', 
		'dijit/_TemplatedMixin',
		'dijit/_WidgetsInTemplateMixin',
		'dijit/Dialog',

		'src/Reg',
		'src/RulesConfig',

		'dojo/text!./OptionPanel.html',

		'dijit/form/Select',
		'dijit/form/Button',
		'dijit/form/ValidationTextBox'
		], 
function(declare, lang, array, query, on, domAttr, domStyle, domConstruct, xhr, json,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Dialog, 
		Reg, RulesConfig,
		template, Select, Button, ValidationTextBox){

return declare([Dialog, _WidgetsInTemplateMixin], {

	templateString: template,

	page: null,

	rule: null,

	postMixInProperties: function(){
		var t = this.t = this.title;
		this.title = '选择 ' + t + ' 后';

		if (this.type === 'widget') {
			this.title = '对' + t + '添加题逻辑';
		}

		if (this.type ==='delete') {
			this.title = '确认删除此条规则？';
		}
		this.inherited(arguments);
	},

	ruleDef: null,

	postCreate:function() {

		if (this.type === 'widget') {
			console.log('widget');
			domStyle.set(this.actionSelWrapper, 'display', 'block');
			this._initAction(this.self);
		}

		if (this.type === 'item') {
			console.log('item');
			domStyle.set(this.targetSelWrapper, 'display', 'block');
			this._initWidgets();
		}

		this.okBtn.set('disabled', true);

		if (this.type ==='delete') {
			this.ruleLabel.innerText = this.rule.label ? this.rule.label :'';
			this.okBtn.set('disabled', false);
		}

		this.ajaxText = query('.ajaxText')[0];
		this.inherited(arguments);
	},

	_initWidgets: function() {

		this.targetSel.addOption({
			label: '请选择操作的题目',
			value: 'first',
			disabled: true
		});

		var lis = query('form>ul>li', this.page);

		array.some(lis, function(li, pos) {
			if (li.id == this.self.eId) {
				this.pos = pos;
				return true;
			}
		}, this);


		array.forEach(lis, function(li, pos) {
			var id = domAttr.get(li, 'id'),
				cls = domAttr.get(li, 'class'),
				widget = Reg.byId(id);

			if (id && widget) {
				var label = widget._getCaption() && widget._getCaption().innerText || 'none Caption';
				if (pos >= this.pos){
					this.targetSel.addOption({
						label: pos === this.pos ? label + '[当前题目]': label,
						value: id
					});
				}
			}
		}, this);

		var _this = this;

		on(this.targetSel, 'change', function(){
			if (this.value == 'first') return;
			var widget = this.value == 'self' ? _this.self :  Reg.byId(this.value);
			//var canItemLogic = widget && _this.canItemLogic(widget);
			domStyle.set(_this.actionSelWrapper, 'display', 'block');
			_this._initAction(widget);
			domStyle.set(_this.itemSelWrapper, 'display', 'none');
			domStyle.set(_this.inputSelWrapper, 'display', 'none');
			_this.okBtn.set('disabled', true);
		});

	},

	canItemLogic: function(widget) {
		return widget.declaredClass !== 'Dropdown';
	},

	_initAction: function(widget) {
		this.actionSel.options = [];
		this.actionSel.addOption({
			label: this.type == 'widget' ? '请选择要添加的逻辑' : '请选择要执行的动作',
			value: 'first',
			disabled: true
		});

		array.forEach(widget.actions, function(action){
			if (this.type == 'widget' && action.widgetAction) {
				this.actionSel.addOption({label: action.label, value: action.action});
				return;
			}

			if (this.type == 'item' && !action.widgetAction || action.itemAction) {
				if(action.selfAction && this.targetSel.get('value') !== this.self.eId) return;
				this.actionSel.addOption({label: action.label, value: action.action});
				return;
			}

		}, this);


		var _this = this;
		on(this.actionSel, 'change', function() {

			array.some(widget.actions, function(action){
				var isTheAction = _this.actionSel.get('value') == action.action;
				if (isTheAction && action.tip) {
					domStyle.set(_this.widgetLogicTip, 'display', 'block');
					this.widgetLogicTip.innerText = action.tip;
					return true;
				}

				if (isTheAction && !action.noNeedItem) {
					_this._initItems(widget);
					domStyle.set(_this.widgetLogicTip, 'display', 'none');
					domStyle.set(_this.inputSelWrapper, 'display', 'none');
					domStyle.set(_this.itemSelWrapper, 'display', 'block');
					_this.okBtn.set('disabled', true);
					return true;
				}

				if (isTheAction && action.newParam === 'input') {
					_this.okBtn.set('disabled', true);
					this._createInputParam(widget, action);
					return true;
				}

				domStyle.set(_this.widgetLogicTip, 'display', 'none');
				domStyle.set(_this.inputSelWrapper, 'display', 'none');
				domStyle.set(_this.itemSelWrapper, 'display', 'none');
				_this.okBtn.set('disabled', false);


			}, _this);
			
		});
	},


	_createInputParam: function() {
		domStyle.set(this.inputSelWrapper, 'display', 'block');
		var _this = this;
		on(this.inputSel, 'change', function(){
			_this.okBtn.set('disabled', _this.inputSel.get('value') === '');
		});
	},

	_createExtraParam: function(widget, action){
		this._initItems(widget, true);
		domConstruct.place(this.itemSel.domNode, this.extraParamWrapper);
	},


	_initItems: function(widget, disableOnchange){

			this.itemSel.options = [];
			this.itemSel.addOption({
				label: '请选择操作的选项',
				value: 'first',
				disabled: true
			});

			var items = widget.declaredClass === 'Matrix' ? widget.valueLabels : widget.items;

			array.forEach(items, function(item, i){
				this.itemSel.addOption({
					label: widget.declaredClass === 'Matrix' ?  item: item.label,
					value: i+''
				});
			}, this);

			var _this = this;

			//BIND event
			if (disableOnchange) {
				if(this.itemHandler) this.itemHandler.remove();
				return;
			}
			this.itemHandler = on(this.itemSel, 'change', function() {
				if (this.value == 'first') return;
				_this.okBtn.set('disabled', _this.actionSel.get('value') == 'redirect');

			});

	},


	_getParam: function() {
		if(this.actionSel.get('value') == 'redirect') {
			return this.inputSel.get('value').replace(':', '@');
		} else {
			return this.itemSel.get('value');
		}
		
	},

	_onOk: function() {
		var res,
			isDel = this.type === 'delete';
		if (isDel) {
			res = this.rule;
		} else {
			var isWidget = this.type === 'widget';
			var param = this._getParam(),
				action = this.actionSel.get('value'),
				targetLabel = this.targetSel.get('displayedValue'),
				itemLabel  =  this.itemSel.get('displayedValue'),
				actionLabel =  this.actionSel.get('displayedValue');

			var label = '选择' + this.t + '后，' +
						 (actionLabel ? actionLabel: '')  + 
						 (targetLabel ? targetLabel : '' )  +
						  (itemLabel ? itemLabel : '');

			label = label.replace(',', ' ');
			label = label.replace('，', ' ');


			res = {
				source: isWidget ? this.self.eId : this.source.eId,
				target : isWidget? 'self' : this.targetSel.get('value'),
				action: action,
				param: param === '' ? 'null' : param,
				label: label
			};
		}
		console.log('res ', res);

		var formId = query('form', this.page)[0].id.split('_')[1];
		var data = this.formatData(res, isDel); 

		console.log('data is', data, formId);

		// Using xhr.post, as the amount of data sent could be large
		xhr.post({
			// The URL of the request
			url: "save_form.php",

			content: {form_id: formId, 'fp[logic_data]': data},

			// The success handler
			load: lang.hitch(this, function(response) {
				console.log('we done');
				if (isDel) {
					delete Reg.data[res.source];
				} else {
					Reg.data[res.source] = res;
				}

				this.ajaxText.innerText = '操作成功';
				this.onOk(res);
			}),
			// The error handler
			error: lang.hitch(this, function() {
				console.log('error', this.ajaxText);
				this.ajaxText.innerText = '操作失败，请重新尝试';
			}),
			// The complete handler
			handle: lang.hitch(this, function() {
				var a = this.ajaxText;
				setTimeout(function(){
					console.log(a);
					a.innerText = '';
				}, 2000);
				console.log('complete handler');
			})
		});

		//this.onOk(res);
		//this.inherited(arguments);
	},

	formatData: function(res, isDel){
		var data = lang.clone(Reg.data);
		if (isDel) {
			delete data[res.source];
		} else {
			data[res.source] = res;
		}
		return json.stringify(data);
	},

	destroy: function() {
		this.okBtn.destroy();
		this.cancelBtn.destroy();
		this.inherited(arguments);
	}


});
});