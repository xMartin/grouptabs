define([
	"gka/_View",
	"dojo/dom-construct",
	"dijit/registry",
	"dijit/form/Button",
	"dojo/text!./templates/ListView.html"
], function(_View, domConstruct, widgetRegistry, Button, template){

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
		var store = this.app.store, transactions, rowCount = 0, tableNode, rowNode, detailsNode, detailsButton
		if(!store){
			return
		}
		transactions = store.query({"box": this.app.box}, {"sort": [{"attribute": "date", "descending": true}]})
		tableNode = document.createElement("TABLE")
		transactions.forEach(function(transaction){
			rowNode = domConstruct.toDom("<tr class='" + (rowCount % 2 == 0 ? "even" : "odd") + "'>")
			this.connect(rowNode, "onclick", function(evt){
				this._onDetailsClick(evt, transaction.id)
			})
			rowNode.appendChild(domConstruct.toDom("<td class='date'>" + new Date(transaction.date).toLocaleDateString() + "</td>"))
			rowNode.appendChild(domConstruct.toDom("<td class='title'>" + transaction.title + "</td>"))
			tableNode.appendChild(rowNode)
			rowCount++
		}, this)
		this.listNode.appendChild(tableNode)
	},
	
	_clearList: function(){
		domConstruct.empty(this.listNode)
	},
	
	_onBackClick: function(){
		this.close(this, "main")
	},
	
	_onNewEntryClick: function(){
		this.close(this, "newEntry")
	},
	
	_onDetailsClick: function(evt, id){
		this.close(this, "details", {entryId: id})
	}
})

})
