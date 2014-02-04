define([
	"dojo/number",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/ListItem.html"
], function(number, Widget, _Templated, template){

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
			payments += payment.participant + ": " + number.format(payment.amount, {places: 2})
		})
		this.tplVars.payments = payments
		var total = 0.0
		paymentsList.forEach(function(payment, idx){
			total += payment.amount
		})
		this.tplVars.total = number.format(total, {places: 2})
		this.inherited(arguments)
	}
	
})

})
