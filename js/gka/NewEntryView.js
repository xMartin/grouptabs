define([
	"gka/_View",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"./ParticipantFormWidget",
	"dojo/text!./templates/NewEntryView.html"
], function(_View, ValidationTextBox, DateTextBox, ParticipantFormWidget, template){

return dojo.declare(_View, {
	
	templateString: template,
	
	name: "newEntry",
	
	constructor: function(){
		this._participantFormWidgets = []
	},
	
	onShow: function(){
		this._updateParticipants()
		if(!this._participantFormWidgets.length){
			this._addParticipantFormWidget()
		}
	},
	
	_updateParticipants: function(){
		var participants = []
		var accounts = this.app.getAccounts()
		for(var account in accounts){
			participants.push({id: account})
		}
		this._participants = participants
	},
	
	_addParticipantFormWidget: function(){
		var widget = new ParticipantFormWidget({
			name: "participants",
			participants: this._participants,
			parent: this,
			onRemoveClick: dojo.hitch(this, this._removeParticipantFormWidget)
		}).placeAt(this.participantsNode)
		this._participantFormWidgets.push(widget)
	},
	
	_removeParticipantFormWidget: function(widget){
		this.participantsNode.removeChild(widget.domNode)
		widget.destroy()
		this._participantFormWidgets = dojo.filter(this._participantFormWidgets, function(_widget){
			return _widget !== widget
		})
	},
	
	_onPlusParticipantClick: function(){
		this._addParticipantFormWidget()
	},
	
	_onOkClick: function(){
		this._saveEntry()
		this.reset()
		this.close(this, "main")
	},
	
	_onCancelClick: function(){
		this.reset()
		this.close(this, "main")
	},
	
	_saveEntry: function(){
		var data = this.get("value")
		var participants = dojo.filter(data.participants, function(participant){
			return participant.participant
		})
		participants = dojo.map(participants, function(participant){
			return participant.participant
		})
		var payments = dojo.filter(data.participants, function(participant){
			return participant.participant && participant.amount
		})
		payments = dojo.map(payments, function(participant){
			return {participant: participant.participant, amount: participant.amount}
		})
		this.app.saveEntry({
			id: "" + new Date().getTime(),
			box: this.app.box,
			type: "spending",
			title: data.title,
			date: data.date.getTime(),
			participants: participants,
			payments: payments
		})
	},
	
	reset: function(){
		this.inherited(arguments)
		dojo.forEach(this._participantFormWidgets, function(widget, i){
			if(i === 0){
				widget.reset()
			}else{
				this._removeParticipantFormWidget(widget)
			}
		}, this)
	}

})

})
