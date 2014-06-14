define([
	"dojo/_base/declare",
	"dojo/dom-class",
	"./ParticipantInput",
	"dojo/text!./templates/NewParticipantInput.html",
	"dijit/form/TextBox"
], function(declare, domClass, ParticipantInput, template){

return declare(ParticipantInput, {

	templateString: template,

	baseClass: "newParticipantInput",
	
	_setValue: function(){
		var checked = this.joinedButton.get("checked")
		this.set("selected", checked)
		var name = this.participantInput.get("value")
		if(checked && name){
			this.value = {
				participant: name,
				amount: (domClass.contains(this.amountInput.domNode, "hidden") ? "" : this.amountInput.get("value")) || 0
			}
		}else{
			this.value = {}
		}
	},

	_setFocusAttr: function(focus){
		focus && this.participantInput.focus()
	},

	_displayName: function(){

	}

})

})
