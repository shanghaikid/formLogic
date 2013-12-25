// _Rule.js
// 
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/string'

		], 
function(declare, lang, array, string){

return declare(null, {
// {target:'li_4', status: 'checked', action:'check', param:'all'} 
// ["target:'li_4'", " status: 'checked'", " action:'check'", " param:'all'"] 

	parseRule : function(rule) {
		var result = null,
			tmp;
		if(rule !== null) {
			result = {};
			tmp = rule.substring(1, rule.length -1).split(',');
			array.forEach(tmp, function(rule) {
				var keypair = this._parseSingleRule(rule);
				result[keypair[0]] = keypair[1];
			}, this);

		}
		return result;
	},

	_parseSingleRule: function(rule){
		var tmp = rule.split(':');
		tmp[0] = string.trim(tmp[0]);
		tmp[1] = string.trim(tmp[1]);
		return tmp;
	},

	//{target: "li_4", status: "checked", action: "check", param: "all"} 
	stringfy: function(obj){
		var str = '{';
		this.objEach(obj, function(value, key){
			str += key.toString() + ":"+ value.toString();
			str += ', ';
		});
		str = str.substring(0, str.length - 2);
		str += '}';
		return str;
	},

	objEach: function(obj, f, scope){
		for(var key in obj){
			if(obj.hasOwnProperty(key)){
				f.call(scope, obj[key], key);
			}
		}
	},

	a: function(){console.log('none action executed');},

	execute: function(rule) {
		var status = rule.status || null;
		var verified = this._verify(status);

		if (!verified) return;
		var p = rule.param === null || rule.param === 'all' ? undefined : rule.param;
		var a = this.actionMap[rule.action] || this.a;
		var target = this._getTarget(rule);
		a.apply(target, [p]);
	},

	_verify: function() {
		return true;
	}


});
});