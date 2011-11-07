define([
	"gka/_View",
	"dojo/text!./templates/SummaryView.html"
], function(_View, template){

return dojo.declare(_View, {
	
	templateString: template,
	
	name: "summary",
	
	postCreate: function(){
		this._renderSummary()
	},
	
	onShow: function(){
		this.refreshSummary()
	},
	
	refreshSummary: function(){
		this._clearSummary()
		this._renderSummary()
	},
	
	_renderSummary: function(){
		var accounts, account, rowCount = 0, html, amount
		accounts = this.app.getAccounts()
		html = "<table>"
		for(account in accounts){
			amount = accounts[account].toFixed(2) + " €"
			html +=
				"<tr class='" + (rowCount % 2 == 0 ? "even" : "odd") + "'>"
				+ "<th class='account'>" + account + ": </th>"
				+ "<td class='amount'>" + amount + "</td>"
				+ "</tr>"
			rowCount++
		}
		html += "</table>"
		this.summaryNode.appendChild(dojo._toDom(html))
	},
	
	_clearSummary: function(){
		dojo.empty(this.summaryNode)
	},
	
	_onBackClick: function(){
		this.close(this, "main")
	}
})

})
