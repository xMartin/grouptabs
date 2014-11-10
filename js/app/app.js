define([
	"./store",
	"./sceneController",
//	"./views/Tabs",
	"./views/Main",
	"./views/EditEntry",
	"./views/TransactionList"
], function(store, sceneController, /*TabsScene, */MainScene, EditEntryScene, TransactionListScene){
"use strict";

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

	homeView: "main",

	init: function(){
		var tabId = location.hash.substring(1)
		if(!tabId){
			tabId = generateTabId()
			location.hash = tabId
		}
		this.setTab(tabId)

		store.init(tabId).then(function (){
			store.setupChangesListener(sceneController.refreshAll.bind(sceneController))
			var sceneName, scene,
				scenes = {
					// "tabs": new TabsScene({app: this, controller: sceneController, store: store}),
					"main": new MainScene({app: this, controller: sceneController, store: store}),
					"newEntry": new EditEntryScene({app: this, controller: sceneController, store: store}),
					"list": new TransactionListScene({app: this, controller: sceneController, store: store})
				}

			for(sceneName in scenes){
				scene = scenes[sceneName]
				sceneController.addScene(scene)
			}
			sceneController.selectScene(this.tab ? scenes["main"] : scenes["tabs"])
		}.bind(this))
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
	}
}

})
