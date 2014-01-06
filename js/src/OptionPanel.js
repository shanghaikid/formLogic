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

		'dijit/Form/Select',

		'src/Reg',
		'src/RulesConfig',

		'dojo/text!./OptionPanel.html',

		'dijit/Form/Button'

		], 
function(declare, lang, array, query, on, domAttr, domStyle, domConstruct, xhr, json,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Dialog, 
		Select, 
		Reg, RulesConfig,
		template){

return declare([Dialog, _WidgetsInTemplateMixin], {

	templateString: template,

	page: null,

	rule: null,

	postMixInProperties: function(){
		var t = this.title;
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
			domStyle.set(this.itemSelWrapper, 'display', 'none');
			domStyle.set(this.actionSelWrapper, 'display', 'block');
			domStyle.set(this.targetSelWrapper, 'display', 'none');
			this._initAction(this.self);
		}

		if (this.type === 'item') {
			domStyle.set(this.itemSelWrapper, 'display', 'none');
			domStyle.set(this.actionSelWrapper, 'display', 'none');
			this._initWidgets();
		}

		this.okBtn.set('disabled', true);

		if (this.type ==='delete') {
			this.okBtn.set('disabled', false);
			domStyle.set(this.itemSelWrapper, 'display', 'none');
			domStyle.set(this.actionSelWrapper, 'display', 'none');
			domStyle.set(this.targetSelWrapper, 'display', 'none');
		}


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
			var canItemLogic = widget && _this.canItemLogic(widget);
			domStyle.set(_this.itemSelWrapper, 'display', canItemLogic ? 'block': 'none');
			domStyle.set(_this.actionSelWrapper, 'display', canItemLogic ? 'none': 'block');

			if (canItemLogic) {
				_this._initItems(widget);
			} else {
				_this._initAction(widget);
			}
		});

	},

	canItemLogic: function(widget) {
		return widget.declaredClass !== 'Dropdown';
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
				domStyle.set(_this.actionSelWrapper, 'display', 'block');
				_this._initAction(widget);
			});

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
			}

			if (this.type == 'item' && !action.widgetAction) {
				this.actionSel.addOption({label: action.label, value: action.action});
			}

		}, this);


		var _this = this;
		on(this.actionSel, 'change', function() {
			array.some(widget.actions, function(action){
				var isTheAction = _this.actionSel.get('value') == action.action;
				if (isTheAction && action.tip) {
					this.widgetLogicTip.innerText = action.tip;
					return true;
				}

				if (isTheAction && action.showItemSel) {
					this._createExtraParam(widget, action);
					return true;
				}

			}, _this);
			_this.okBtn.set('disabled', false);
		});
	},

	_createExtraParam: function(widget, action){
		this._initItems(widget, true);
		domConstruct.place(this.itemSel.domNode, this.extraParamWrapper);
	},

	_onOk: function() {
		var res,
			isDel = this.type === 'delete';
		if (isDel) {
			res = this.rule;
		} else {
			var isWidget = this.type === 'widget';
			var param = this.itemSel.get('value'),
				action = this.actionSel.get('value');

			res = {
				source: isWidget ? this.self.eId : this.source.eId,
				target : isWidget? 'self' : this.targetSel.get('value'),
				action: action,
				param: param === '' ? 'null' : param*1
			};
		}

		var formId = query('form', this.page)[0].id.split('_')[1];

		var data = this.formatData(res, isDel); //json.stringify(res);

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
				this.onOk(res);
			}),
			// The error handler
			error: function() {
				console.warn("Your message could not be sent, please try again.");
			},
			// The complete handler
			handle: lang.hitch(this, function() {
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