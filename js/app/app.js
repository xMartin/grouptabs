define([
	"remotestorage",
	"./RemoteStorageStoreAdapter",
	"./sceneController",
	"./views/Tabs",
	"./views/Main",
	"./views/EditEntry",
	"./views/TransactionList"
], function(remoteStorage, RemoteStorageAdapter, sceneController, TabsScene, MainScene, EditEntryScene, TransactionListScene){

var remoteStorageAdapter = new RemoteStorageAdapter()
var store = remoteStorageAdapter.store

var obj = {
	
	tab: localStorage.getItem("box") || "",

	homeView: "main",

	store: store,

	init: function(){
		var sceneName, scene,
			scenes = {
				"tabs": new TabsScene({app: obj, controller: sceneController}),
				"main": new MainScene({app: obj, controller: sceneController}),
				"newEntry": new EditEntryScene({app: obj, controller: sceneController}),
				"list": new TransactionListScene({app: obj, controller: sceneController})
			}
		
		for(sceneName in scenes){
			scene = scenes[sceneName]
			sceneController.addScene(scene)
		}
		sceneController.selectScene(obj.tab ? scenes["main"] : scenes["tabs"])
		
		// init remote storage
		remoteStorage.access.claim("gruppenkasse", "rw")
		remoteStorage.displayWidget()
		remoteStorage.gruppenkasse.init()
		RemoteStorage.config.changeEvents.local = false  // we use `getAll` to get cached data so no need for local change events
		remoteStorage.on("ready", function(){
			remoteStorage.gruppenkasse.getTransactions().then(function(data){
				var items = [],
					dirty = false
				for(var id in data){
					items.push(data[id])
				}
				store.setData(items)
				sceneController.refreshAll()
				remoteStorage.gruppenkasse.on("change", function(event){
					if(event.newValue && event.oldValue){
						// Do nothing on update to work around https://github.com/xMartin/grouptabs/issues/34.
						// There's no update for now anyway.
						//console.log(event.path + " was updated")
					}else if(event.newValue){
						console.log("remoteStorage created " + event.path)
						store.put(event.newValue)
						dirty = true
					}else if(event.oldValue){
						console.log("remoteStorage deleted " + event.path)
						store.remove(event.oldValue.id)
						dirty = true
					}
				})
				remoteStorage.sync.on("done", function(){
					if(dirty){
						sceneController.refreshAll()
						dirty = false
					}
				})
			})
			remoteStorage.on("disconnected", function(){
				store.setData([])
				sceneController.refreshAll()
				sceneController.selectScene(scenes["tabs"])
			})
		})

	},
	
	getAccounts: function(){
		var accounts = {}
		store.query({"box": obj.tab}).forEach(function(transaction){
			transaction.payments.forEach(function(payment){
				var share = payment.amount / transaction.participants.length
				transaction.participants.forEach(function(participant){
					accounts[participant] = accounts[participant] || 0
					accounts[participant] -= share
					if(payment.participant == participant){
						accounts[participant] += payment.amount
					}
				})
			})
		})
		return accounts
	},
	
	setTab: function(tabName){
		obj.tab = tabName
		localStorage.setItem("box", tabName)
	},

	setHomeView: function(viewName){
		obj.homeView = viewName
	},
	
	saveEntry: function(data){
		remoteStorageAdapter.put(data)
	},
	
	deleteEntry: function(id){
		remoteStorageAdapter.remove(id)
	}
}

return obj

})
