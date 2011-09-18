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
			amount = Math.round(accounts[account]) + " €"
			textNode = document.createTextNode(amount)
			cellNode.appendChild(textNode)
		}
		this.domNode.appendChild(tableNode)
	},
	
	_onBackClick: function(){
		this.close(this, "main")
	}
})

})
