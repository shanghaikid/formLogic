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
function(declare, lang, array, query, on, domAttr, domStyle,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Dialog, 
		Select, 
		Reg, RulesConfig,
		template){

return declare([Dialog, _WidgetsInTemplateMixin], {

	templateString: template,

	page: null,

	postMixInProperties: function(){
		this.title = '选择 ' + this.title + ' 后';
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
			this._initWidgets();
			domStyle.set(this.itemSelWrapper, 'display', 'none');
			domStyle.set(this.actionSelWrapper, 'display', 'none');
		}

		this.okBtn.set('disabled', true);

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
		return widget.declaredClass ==='Checkboxes' || widget.declaredClass === 'MultipleChoice';
	},

	_initItems: function(widget){

			this.itemSel.options = [];
			this.itemSel.addOption({
				label: '请选择操作的选项',
				value: 'first',
				disabled: true
			});

			array.forEach(widget.items, function(item, i){
				this.itemSel.addOption({
					label: item.label,
					value: i+''
				});
			}, this);

			var _this = this;

			//BIND event
			on(this.itemSel, 'change', function() {
				domStyle.set(_this.actionSelWrapper, 'display', 'block');
				_this._initAction(widget);
			});

	},

	_initAction: function(widget) {
		this.actionSel.options = [];
		this.actionSel.addOption({
			label: '请选择要执行的动作',
			value: 'first',
			disabled: true
		});

		console.log('dddd', widget.actions);
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
			_this.okBtn.set('disabled', false);
		});
	},

	_onOk: function() {
		console.log('on _ok');
		var isWidget = this.type === 'widget';
		var res = {
			source: isWidget ? null : this.source.eId,
			target : isWidget? 'self' : this.targetSel.get('value'),
			action: this.actionSel.get('value'),
			param: this.itemSel.get('value')*1
		};

		this.onOk(res);
		//this.inherited(arguments);
	},

	destroy: function() {
		this.okBtn.destroy();
		this.cancelBtn.destroy();
		this.inherited(arguments);
	}




});
});