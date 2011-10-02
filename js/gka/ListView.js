define([
	"gka/_View",
	"gka/app",
	"dojo/text!./templates/ListView.html"
], function(_View, app, template){

return dojo.declare(_View, {
	
	templateString: template,
	
	name: "list",
	
	postCreate: function(){
		this._renderList()
	},
	
	onShow: function(){
		this.refreshList()
	},
	
	refreshList: function(){
		this._clearList()
		this._renderList()
	},
	
	_renderList: function(){
		var accounts, transactions, rowCount = 0, html
		accounts = app.getData()
		if(!accounts){
			return
		}
		transactions = accounts.transactions
		html = "<table>"
		transactions.forEach(function(transaction){
			html +=
				"<tr class='" + (rowCount % 2 == 0 ? "even" : "odd") + "'>"
				+ "<td class='date'>" + transaction.date + "</td>"
				+ "<td class='title'>" + transaction.title + "</td>"
				+ "</tr>"
			rowCount++
		})
		html += "</table>"
		this.listNode.appendChild(dojo._toDom(html))
	},
	
	_clearList: function(){
		dojo.empty(this.listNode)
	},
	
	_onBackClick: function(){
		this.close(this, "main")
	}
})

})
