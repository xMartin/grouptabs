define([
	"./_Scene",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/dom-construct",
	"dijit/a11yclick",
	"dijit/form/Button",
	"./TransactionListItem",
	"dojo/text!./templates/TransactionList.html"
], function(_Scene, declare, lang, on, domConstruct, a11yclick, Button, ListItem, template){

return declare(_Scene, {
	
	templateString: template,
	
	name: "list",

	constructor: function(){
		this._listItems = []
	},
	
	postCreate: function(){
		this._renderList()
	},
	
	onShow: function(){
		this.refresh()
	},

	refresh: function(){
		this.tabNameNode.innerHTML = this.app.tab
		this.refreshList()
	},
	
	refreshList: function(){
		this._clearList()
		this._renderList()
	},
	
	_renderList: function(){
		var store = this.app.store
		if(!store){
			return
		}
		var transactions = store.query({"box": this.app.tab}, {"sort": [{"attribute": "date", "descending": true}, {"attribute": "id", "descending": true}]})
		var day
		transactions.forEach(function(transaction){
			var currentDay = new Date(transaction.date).toLocaleDateString()
			if(currentDay != day){
				var dateString = "<div class='dategroup'>" + currentDay + "</div>"
				domConstruct.place(dateString, this.listNode)
				day = currentDay
			}
			var listItem = new ListItem({app: this.app, entryId: transaction.id})
			on(listItem.domNode, a11yclick, lang.hitch(this, function(){
				this._onDetailsClick(transaction.id)
			}))
			listItem.placeAt(this.listNode)
			this._listItems.push(listItem)
		}, this)
	},
	
	_clearList: function(){
		this._listItems.forEach(function(listItem){
			listItem.destroy()
		})
		this.listNode.innerHTML = ""
		this._listItems = []
	},
	
	_onChangeTabClick: function(){
		this.close(this, "tabs")
	},
	
	_onPeopleClick: function(){
		this.close(this, "main")
	},
	
	_onNewEntryClick: function(){
		this.close(this, "editEntry")
	},
	
	_onDetailsClick: function(id){
		this.close(this, "editEntry", id)
	}
})

})
