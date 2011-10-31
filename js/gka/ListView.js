define([
	"gka/_View",
	"gka/app",
	"dijit/form/Button",
	"dojo/text!./templates/ListView.html"
], function(_View, app, Button, template){

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
		var store = app.store, transactions, rowCount = 0, tableNode, rowNode, detailsNode, detailsButton
		if(!store){
			return
		}
		transactions = store.query(function(){return true}, {"sort": [{"attribute": "date", "descending": false}]})
		tableNode = document.createElement("TABLE")
		transactions.forEach(function(transaction){
			rowNode = dojo._toDom("<tr class='" + (rowCount % 2 == 0 ? "even" : "odd") + "'>")
			rowNode.appendChild(dojo._toDom("<td class='date'>" + new Date(transaction.date).toLocaleDateString() + "</td>"))
			rowNode.appendChild(dojo._toDom("<td class='title'>" + transaction.title + "</td>"))
			detailsNode = dojo._toDom("<td class='details'></td>")
			detailsButton = new Button({label: "Details"}).placeAt(detailsNode)
			this.connect(detailsButton, "onClick", function(evt){
				this._onDetailsClick(evt, transaction.id)
			})
			rowNode.appendChild(detailsNode)
			tableNode.appendChild(rowNode)
			rowCount++
		}, this)
		this.listNode.appendChild(tableNode)
	},
	
	_clearList: function(){
		dojo.empty(this.listNode)
	},
	
	_onBackClick: function(){
		this.close(this, "main")
	},
	
	_onDetailsClick: function(evt, id){
		this.close(this, "details", {entryId: id})
	}
})

})
