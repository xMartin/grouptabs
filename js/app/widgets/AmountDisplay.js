define([
	"dojo/_base/declare",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/AmountDisplay.html"
], function(declare, _Widget, _TemplatedMixin, template){

return declare([_Widget, _TemplatedMixin], {

	templateString: template,
	
	baseClass: "amountDisplay",
	
	amount: 0,

	postMixInProperties: function(){
		var amount = Math.round(this.amount * 100) / 100
		var parts = (amount + "").split(".")
		this.tplVars = {
			preDecimals: parts[0]
		}
		var decimals = parts[1]
		if(decimals){
			if(decimals.length === 1){
				decimals += "0"
			}
		}else{
			decimals = "00"
		}
		this.tplVars.decimals = decimals
	},

	toHtml: function(){
		return this.domNode.outerHTML
	}

})

})
