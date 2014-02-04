define([
	"dojo/_base/lang",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/form/CheckBox",
	"dijit/form/NumberTextBox",
	"dojo/number",
	"dojo/dom-class",
	"dojo/text!./templates/ParticipantFormWidget.html"
], function(lang, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, CheckBox, NumberTextBox, number, domClass, template){

return dojo.declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

	templateString: template,
	
	baseClass: "participantInput",
	
	// make this a form-compatible widget
	value: null,
	name: "",

	selected: false,

	_setSelectedAttr: function(isSelected){
		domClass.toggle(this.domNode, "selected", isSelected)
		if(!isSelected){
			this.amountInput.set("value", "")
		}
	},

	buildRendering: function(){
		this.inherited(arguments)

		// HACK set amount input dijit's input type to HTML5's "number"
		this.amountInput.textbox.setAttribute("type", "number")
	},
	
	postCreate: function(){
		this._setValue()
		this.participantNode.innerHTML = this.participant
		this.amountInput.set("placeholder", number.format(0, {places: 2}))
		if(this.amount){
			this.amountInput.set("value", this.amount)
		}
		this.amountInput.onChange = lang.hitch(this, "_setValue")
		this.checkBox.onChange = lang.hitch(this, "_setValue")
	},

	_setValue: function(){
		var checked = this.checkBox.get("value")
		this.set("selected", checked)
		if(checked){
			this.value = {
				participant: this.participant,
				amount: this.amountInput.get("value") || 0
			}
		}else{
			this.value = {}
		}
	},

	_onAmountInput: function(){
		if(this.amountInput.get("value") && !this.checkBox.get("value")){
			this.checkBox.set("value", true)
		}
	}
	
})

})
