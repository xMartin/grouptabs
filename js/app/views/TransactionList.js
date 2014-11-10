define([
	"ring",
	"react",
	"./_Scene",
	"../components/list"
	// "dojo/_base/declare",
	// "dojo/_base/lang",
	// "dojo/on",
	// "dojo/dom-construct",
	// "dijit/a11yclick",
	// "dijit/form/Button",
	// "./TransactionListItem",
	// "dojo/text!./templates/TransactionList.html"
], function(ring, React, _Scene, ListComponentClass/*, declare, lang, on, domConstruct, a11yclick, Button, ListItem, template*/){

var ListComponent = React.createFactory(ListComponentClass)

return ring.create([_Scene], {

	// templateString: template,

	name: "list",

	postCreate: function(){
		this.$super()
		this.domNode.className = "scene listScene"
		this.component = React.render(ListComponent({
			tabName: this.app.tab,
			data: this.store.getTransactions(),
			handleChangeTabClick: this._onChangeTabClick.bind(this),
			handlePeopleClick: this._onPeopleClick.bind(this),
			handleNewEntryClick: this._onNewEntryClick.bind(this),
			handleDetailsClick: this._onDetailsClick.bind(this)
		}), this.domNode)
	},
	
	onShow: function(){
		this.app.setHomeView("list")
	},

	refresh: function(){
		// this.tabNameNode.innerHTML = this.app.tab
		console.log('refresh', this.store.getTransactions())
		this.component.setProps({data: this.store.getTransactions()})
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
	
	_onDetailsClick: function(transaction){
		this.close(this, "editEntry", transaction)
	}
})

})
