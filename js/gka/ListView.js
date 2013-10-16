define([
	"gka/_View",
	"dojo/_base/lang",
	"dojo/on",
	"dijit/a11yclick",
	"dijit/form/Button",
	"./ListItem",
	"dojo/text!./templates/ListView.html"
], function(_View, lang, on, a11yclick, Button, ListItem, template){

return dojo.declare(_View, {
	
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
		this.boxNameNode.innerHTML = this.app.box
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
		var transactions = store.query({"box": this.app.box}, {"sort": [{"attribute": "date", "descending": true}]})
		transactions.forEach(function(transaction){
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
		this._listItems = []
	},
	
	_onChangeBoxClick: function(){
		this.close(this, "box")
	},
	
	_onPeopleClick: function(){
		this.close(this, "main")
	},
	
	_onNewEntryClick: function(){
		this.close(this, "newEntry")
	},
	
	_onDetailsClick: function(id){
		this.close(this, "details", {entryId: id})
	}
})

})
