define([
	"./store",
	"react",
	"./components/app"
], function(store, React, AppComponentClass){
"use strict";

var AppComponent = React.createFactory(AppComponentClass)

function generateTabId(){
	var chars = "0123456789abcdefghijklmnopqrstuvwxyz"
	var result = ""
	for (var i = 0; i < 7; ++i) {
		result += chars.substr(Math.floor(Math.random() * chars.length), 1);
	}
	return result
}

return {

	store: store,

	tab: localStorage.getItem("box") || "",

	init: function(){
		var tabId = location.hash.substring(1)
		if(!tabId){
			tabId = generateTabId()
			location.hash = tabId
		}
		this.setTab(tabId)

		this.component = React.render(AppComponent({
			tabName: this.tab,
			saveTransaction: store.saveTransaction.bind(store),
			removeTransaction: store.removeTransaction.bind(store)
		}), document.body)

		store.init(tabId).then(function (){
			store.setupChangesListener(this.refreshUi.bind(this))
			this.refreshUi()
		}.bind(this))
	},

	refreshUi: function(){
		this.component.setProps({
			transactions: store.getTransactions(),
			accounts: store.getAccounts(),
			participants: store.getParticipants()
		})
	},

	tempTabs: [],

	getTabs: function(){
		var tabs = []
		// store.query(function(){return true}).forEach(function(transaction){
		// 	if(transaction.box && tabs.indexOf(transaction.box) === -1){
		// 		tabs.push(transaction.box)
		// 	}
		// })
		this.tempTabs.forEach(function(tempTab) {
			if(tempTab !== "" && tabs.indexOf(tempTab) === -1){
				tabs.push(tempTab)
			}
		})
		return tabs
	},
	
	setTab: function(tabName){
		this.tab = tabName
		this.tempTabs.push(tabName)
		localStorage.setItem("box", tabName)
	}
}

})
