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
		var store = app.store, transactions, rowCount = 0, tableNode, rowNode, deleteNode, deleteButton
		if(!store){
			return
		}
		transactions = store.query(function(){return true}, {"sort": [{"attribute": "date", "descending": false}]})
		tableNode = document.createElement("TABLE")
		transactions.forEach(function(transaction){
			rowNode = dojo._toDom("<tr class='" + (rowCount % 2 == 0 ? "even" : "odd") + "'>")
			rowNode.appendChild(dojo._toDom("<td class='date'>" + new Date(transaction.date).toLocaleDateString() + "</td>"))
			rowNode.appendChild(dojo._toDom("<td class='title'>" + transaction.title + "</td>"))
			deleteNode = dojo._toDom("<td class='delete'></td>")
			deleteButton = new Button({label: "löschen"}).placeAt(deleteNode)
			this.connect(deleteButton, "onClick", function(evt){
				this._onDeleteClick(evt, transaction.id)
			})
			rowNode.appendChild(deleteNode)
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
	
	_onDeleteClick: function(evt, id){
		app.deleteEntry(id)
		this.refreshList()
	}
})

})
