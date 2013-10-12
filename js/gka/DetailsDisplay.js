define([
	"dojo/number",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/DetailsDisplay.html"
], function(number, Widget, _Templated, template){

return dojo.declare([Widget, _Templated], {
	
	templateString: template,
	
	entryId: "",
	
	postMixInProperties: function(){
		var data = this.app.store.get(this.entryId),
			participants = "",
			payments = ""
		this.tplVars = {
			title: data.title,
			date: new Date(data.date).toLocaleDateString()			
		}
		data.participants.forEach(function(participant, idx){
			idx && (participants += ", ")
			participants += participant
		})
		this.tplVars.participants = participants
		data.payments.forEach(function(payment, idx){
			idx && (payments += ", ")
			payments += payment.participant + ": " + number.format(payment.amount, {fractional: false})
		})
		this.tplVars.payments = payments
		this.inherited(arguments)
	}
	
})

})
