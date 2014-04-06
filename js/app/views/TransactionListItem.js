define([
	"dojo/_base/declare",
	"dojo/number",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"../widgets/AmountDisplay",
	"dojo/text!./templates/TransactionListItem.html"
], function(declare, number, Widget, _Templated, AmountDisplay, template){

return declare([Widget, _Templated], {
	
	templateString: template,
	
	entryId: "",
	
	postMixInProperties: function(){
		var data = this.app.store.get(this.entryId)
		this.tplVars = {
			title: data.title
		}
		var paymentsList = Array.prototype.slice.call(data.payments)
		paymentsList.sort(function(a, b){
			return a.amount > b.amount ? -1 : 1
		})
		var payments = ""
		var total = 0
		paymentsList.forEach(function(payment, idx){
			idx && (payments += ", ")
			payments += payment.participant + ": " + number.format(payment.amount, {places: 2})
			total += payment.amount
		})
		this.tplVars.payments = payments
		this._total = total
		var participantsList = Array.prototype.slice.call(data.participants)
		var participants = ""
		participantsList.forEach(function(participant){
			for(var i = 0, l = paymentsList.length; i < l; ++i){
				if(paymentsList[i].participant == participant){
					return
				}
			}
			participants += ", " + participant
		})
		this.tplVars.participants = participants
		this.inherited(arguments)
	},

	postCreate: function(){
		new AmountDisplay({amount: this._total}).placeAt(this.totalNode)
	}
	
})

})
