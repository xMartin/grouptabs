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
		var accounts, account,
			tableNode, rowNode, cellNode, textNode,
			amount
		accounts = app.getData()
		if(!accounts){
			return
		}
		accounts = app.getAccounts(accounts.transactions)
		tableNode = document.createElement("TABLE")
		rowNode = document.createElement("TR")
		tableNode.appendChild(rowNode)
		for(account in accounts){
			cellNode = document.createElement("TH")
			rowNode.appendChild(cellNode)
			textNode = document.createTextNode(account)
			cellNode.appendChild(textNode)
		}
		rowNode = document.createElement("TR")
		tableNode.appendChild(rowNode)
		for(account in accounts){
			cellNode = document.createElement("TD")
			rowNode.appendChild(cellNode)
			amount = accounts[account].toFixed(2) + " €"
			textNode = document.createTextNode(amount)
			cellNode.appendChild(textNode)
		}
		this.summaryNode.appendChild(tableNode)
	},
	
	_clearSummary: function(){
		dojo.empty(this.summaryNode)
	},
	
	_onBackClick: function(){
		this.close(this, "main")
	}
})

})
