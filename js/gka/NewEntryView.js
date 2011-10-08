define([
	"gka/_View",
	"gka/app",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"dojo/text!./templates/NewEntryView.html"
], function(_View, app, ValidationTextBox, DateTextBox, template){

return dojo.declare(_View, {
	
	templateString: template,
	
	name: "newEntry",
	
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
		var participants = data.participants.split(",")
		var payments = []
		data.payments.split(",").forEach(function(payment){
			var p = payment.split(":")
			payments.push({participant: p[0], amount: parseFloat(p[1])})
		})
		app.saveEntry({
			id: new Date().getTime(),
			type: "spending",
			title: data.title,
			date: data.date.getTime(),
			participants: participants,
			payments: payments
		})
	}

})

})
