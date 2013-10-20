define([
	"gka/_View",
	"dijit/registry",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"./ParticipantFormWidget",
	"dojo/text!./templates/NewEntryView.html"
], function(_View, dijitRegistry, ValidationTextBox, DateTextBox, ParticipantFormWidget, template){

return dojo.declare(_View, {
	
	templateString: template,
	
	name: "newEntry",
	
	constructor: function(){
		this._participantFormWidgets = []
	},
	
	onShow: function(entryId){
		this._updateParticipants()
		if(entryId !== undefined){
			this._editEntry = entryId
			this._prefill(entryId)
			this._showDeleteButton()
			this.headingNode.innerHTML = "Edit transaction"
		}else{
			this._hideDeleteButton()
			this.headingNode.innerHTML = "New transaction"
			this._addParticipantFormWidget()
			this._addParticipantFormWidget()
		}
	},

	_prefill: function(entryId){
		var data = this.app.store.get(entryId)
		dijitRegistry.byId("newEntryTitle").set("value", data.title)
		dijitRegistry.byId("newEntryDate").set("value", new Date(data.date))
		this._removeParticipantFormWidgets()
		data.participants.forEach(function(participant){
			var widget = this._addParticipantFormWidget()
			widget.comboBox.set("value", participant)
			data.payments.forEach(function(payment){
				if(payment.participant == participant){
					widget.textBox.set("value", payment.amount)
				}
			})
		}, this)
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
		return widget
	},
	
	_removeParticipantFormWidget: function(widget){
		this.participantsNode.removeChild(widget.domNode)
		widget.destroy()
		this._participantFormWidgets = dojo.filter(this._participantFormWidgets, function(_widget){
			return _widget !== widget
		})
	},
	
	_removeParticipantFormWidgets: function(){
		this._participantFormWidgets.forEach(function(widget){
			this._removeParticipantFormWidget(widget)
		}, this)
	},

	_onPlusParticipantClick: function(){
		this._addParticipantFormWidget()
	},
	
	_onOkClick: function(){
		this._saveEntry()
		if(this._editEntry !== undefined){
			this.app.deleteEntry(this._editEntry)
		}
		this.reset()
		this.close(this, "main")
	},

	_onDeleteClick: function(){
		this.app.deleteEntry(this._editEntry)
		this.reset()
		this.close(this, "list")
	},
	
	_onCancelClick: function(){
		this.reset()
		this.close(this, "main")
	},
	
	_onAllClick: function(){
		this._removeParticipantFormWidgets()
		var accounts = this.app.getAccounts()
		for(var account in accounts){
			var widget = this._addParticipantFormWidget()
			widget.comboBox.set("value", account)
		}
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

	_showDeleteButton: function(){
		this.deleteButtonNode.style.display = ""
	},

	_hideDeleteButton: function(){
		this.deleteButtonNode.style.display = "none"
	},
	
	reset: function(){
		this.inherited(arguments)
		delete this._editEntry
		this._hideDeleteButton()
		dojo.forEach(this._participantFormWidgets, function(widget, i){
			this._removeParticipantFormWidget(widget)
		}, this)
	}

})

})
