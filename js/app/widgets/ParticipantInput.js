define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/form/ToggleButton",
	"dijit/form/NumberTextBox",
	"dojo/number",
	"dojo/dom-class",
	"dojo/text!./templates/ParticipantInput.html"
], function(declare, lang, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, CheckBox, NumberTextBox, number, domClass, template){

return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

	templateString: template,
	
	baseClass: "participantInput",
	
	// make this a form-compatible widget
	value: null,
	name: "",

	selected: false,

	// ready is set after the view has been created fully
	ready: false,

	_setSelectedAttr: function(isSelected){
		domClass.toggle(this.domNode, "selected", !!isSelected)
		this.joinedButton.set("checked", !!isSelected)
		if(!isSelected){
			this.amountInput.set("value", "")
		}
	},

	_setReadyAttr: function(ready){
		this.ready = !!ready
		domClass.toggle(this.domNode, "ready", !!ready)
	},

	postCreate: function(){
		this._setValue()
		this._displayName()
		this.amountInput.set("placeholder", number.format(0, {places: 2}))
		if(this.amount){
			this.amountInput.set("value", this.amount)
		}
		this.amountInput.onChange = lang.hitch(this, "_setValue")
		this.joinedButton.onChange = lang.hitch(this, "_setValue")
		this.paidButton.onChange = lang.hitch(this, function(){
			var isPaidChecked = this.paidButton.get("checked")
			domClass.toggle(this.amountInput.domNode, "hidden", !isPaidChecked)
			if(isPaidChecked){
				this.joinedButton.set("checked", true)
				domClass.add(this.joinedButton.domNode, "hidden")
				this.get("ready") && this.amountInput.focusNode.focus()
			}else{
				domClass.remove(this.joinedButton.domNode, "hidden")
				this.get("ready") && this.amountInput.focusNode.blur()
			}
			this._setValue()
		})
	},

	_setValue: function(){
		var checked = this.joinedButton.get("checked")
		this.set("selected", checked)
		if(checked){
			this.value = {
				participant: this.participant,
				amount: (domClass.contains(this.amountInput.domNode, "hidden") ? "" : this.amountInput.get("value")) || 0
			}
		}else{
			this.value = {}
		}
	},

	_displayName: function(){
		this.participantNode.innerHTML = this.participant
	}

})

})
