define([
	"dojo/_base/lang",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/form/CheckBox",
	"dijit/form/NumberTextBox",
	"dojo/number",
	"dojo/text!./templates/ParticipantFormWidget.html"
], function(lang, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, CheckBox, NumberTextBox, number, template){

return dojo.declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

	templateString: template,
	
	baseClass: "participantInput",
	
	// make this a form-compatible widget
	value: null,
	name: "",
	
	postCreate: function(){
		this._setValue()
		this.participantNode.innerHTML = this.participant
		this.amountInput.set("placeholder", number.format(0, {fractional: false}))
		if(this.amount){
			this.amountInput.set("value", this.amount)
		}
		this.amountInput.onChange = lang.hitch(this, "_setValue")
		this.checkBox.onChange = lang.hitch(this, "_setValue")
	},

	_setValue: function(){
		if(this.checkBox.get("value")){
			this.value = {
				participant: this.participant,
				amount: this.amountInput.get("value") || 0
			}
		}else{
			this.value = {}
		}
	}
	
})

})
