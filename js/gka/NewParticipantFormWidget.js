define([
	"dojo/_base/lang",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/number",
	"dojo/text!./templates/NewParticipantFormWidget.html",
	"dijit/form/TextBox",
	"dijit/form/NumberTextBox"
], function(lang, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, number, template){

return dojo.declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

	templateString: template,

	baseClass: "newParticipantInput",
	
	// make this a form-compatible widget
	value: null,
	name: "",

	postCreate: function(){
		this._setValue()
		this.amountInput.set("placeholder", number.format(0, {places: 2}))
		if(this.amount){
			this.amountInput.set("value", this.amount)
		}
		this.amountInput.onChange = lang.hitch(this, "_setValue")
	},

	_setValue: function(){
		var name = this.participantInput.get("value")
		if(name){
			this.value = {
				participant: name,
				amount: this.amountInput.get("value") || 0
			}
		}else{
			this.value = {}
		}
	},

	_setFocusAttr: function(focus){
		focus && this.participantInput.focus()
	},

	_onRemoveClick: function(){
		this.onRemove(this)
	},

	onRemove: function(){}
	
})

})
