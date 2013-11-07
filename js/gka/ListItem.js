define([
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/ListItem.html"
], function(Widget, _Templated, template){

return dojo.declare([Widget, _Templated], {
	
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
		paymentsList.forEach(function(payment, idx){
			idx && (payments += ", ")
			payments += payment.participant + ": " + payment.amount.toFixed(2) + " €"
		})
		this.tplVars.payments = payments
		this.inherited(arguments)
	}
	
})

})
