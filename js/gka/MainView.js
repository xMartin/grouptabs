define([
	"dojo/currency",
	"gka/_View",
	"dojo/text!./templates/MainView.html"
], function(currency, _View, template){

return dojo.declare(_View, {
	
	templateString: template,
	
	name: "main",
	
	postCreate: function(){
		this._renderSummary()
	},
	
	_onChangeBoxClick: function(){
		this.close(this, "box")
	},
	
	_onNewEntryClick: function(){
		this.close(this, "newEntry")
	},
	
	_onSummaryClick: function(){
		this.close(this, "summary")
	},
	
	_onListClick: function(){
		this.close(this, "list")
	},
	
	onShow: function(){
		this.refresh()
	},

	refresh: function(){
		this.boxNameNode.innerHTML = this.app.box
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
			amount = currency.format(accounts[account], {currency: "EUR"})
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
	}
})

})
