define([
	"gka/_View",
	"gka/app"
], function(_View, app){

return dojo.declare(
	"gka.SummaryView",
	[gka._View],
{
	templateString: dojo.cache("gka", "templates/SummaryView.html"),
	
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
		accounts = app.getData()
		if(!accounts){
			return
		}
		accounts = app.getAccounts(accounts.transactions)
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
