define([
	"./store",
	"./sceneController",
	"./views/Tabs",
	"./views/Main",
	"./views/EditEntry",
	"./views/TransactionList"
], function(store, sceneController, TabsScene, MainScene, EditEntryScene, TransactionListScene){
"use strict";

function getTabFromUrl () {
	var match = location.search.match(/\btab=(\w+)/);
	if (match && match.length) {
		return match[1];
	}
}

return {

	store: store,
	
	tab: localStorage.getItem("box") || "",

	homeView: "main",

	init: function(){
		this.setTab(getTabFromUrl())

		store.init(this.tab)
		store.setupChangesListener(sceneController.refreshAll.bind(sceneController))
		store.sync()
		// explicitely cancel syncing, an error is thrown by pouchdb otherwise
		window.addEventListener('unload', function(){
			store.stopSyncing()
		})

		var sceneName, scene,
			scenes = {
				"tabs": new TabsScene({app: this, controller: sceneController}),
				"main": new MainScene({app: this, controller: sceneController}),
				"newEntry": new EditEntryScene({app: this, controller: sceneController}),
				"list": new TransactionListScene({app: this, controller: sceneController})
			}
		
		for(sceneName in scenes){
			scene = scenes[sceneName]
			sceneController.addScene(scene)
		}
		sceneController.selectScene(this.tab ? scenes["main"] : scenes["tabs"])
	},
	
	getAccounts: function(){
		return store.getParticipants()
	},

	getTransactions: function(){
		return store.getTransactions()
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
	},

	setHomeView: function(viewName){
		this.homeView = viewName
	},
	
	saveTransaction: function(data){
		store.saveTransaction(data)
	},
	
	removeTransaction: function(data){
		store.removeTransaction(data)
	}
}

})
