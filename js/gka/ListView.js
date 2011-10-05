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
		var accounts, transactions, rowCount = 0, tableNode, rowNode, deleteNode, deleteButton
		accounts = app.getData()
		if(!accounts){
			return
		}
		transactions = accounts.transactions
		tableNode = document.createElement("TABLE")
		transactions.forEach(function(transaction, idx){
			rowNode = dojo._toDom("<tr class='" + (rowCount % 2 == 0 ? "even" : "odd") + "'>")
			rowNode.appendChild(dojo._toDom("<td class='date'>" + new Date(transaction.date).toLocaleDateString() + "</td>"))
			rowNode.appendChild(dojo._toDom("<td class='title'>" + transaction.title + "</td>"))
			deleteNode = dojo._toDom("<td class='delete'></td>")
			deleteButton = new Button({label: "löschen"}).placeAt(deleteNode)
			this.connect(deleteButton, "onClick", function(evt){
				this._onDeleteClick(evt, idx)
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
		this._deleteEntry(id)
		this.refreshList()
	},
	
	_deleteEntry: function(id){
		var transactions = dojo.fromJson(localStorage.getItem("badminton")).transactions,
			newArr = []
		transactions.forEach(function(t, idx){
			if(idx != id){
				newArr.push(t)
			}
		})
		localStorage.setItem("badminton", dojo.toJson({transactions: newArr}))
	}

})

})
