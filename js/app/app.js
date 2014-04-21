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
			},
			initData = function(){
				remoteStorage.gruppenkasse.getTransactions().then(function(data){
					var items = []
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
							console.log(event.path + " was created")
							addData(event.newValue)
						}else if(event.oldValue){
							console.log(event.path + " was deleted")
							removeData(event.oldValue)
						}
					})
				})
			},
			addData = function(data){
				store.put(data)
				sceneController.refreshAll()
			},
			removeData = function(data){
				store.remove(data.id)
				sceneController.refreshAll()
			},
			emptyData = function(){
				store.setData([])
				sceneController.refreshAll()
				sceneController.selectScene(scenes["tabs"])
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
		remoteStorage.on("features-loaded", function(){
			initData()
			remoteStorage.on("disconnect", function(){
				emptyData()
			})
		})

	},
	
	getAccounts: function(transactions){
		var costs = 0, share = 0, accounts = {}
		store.query({"box": obj.tab}).forEach(function(transaction){
			transaction.payments.forEach(function(payment){
				costs += payment.amount
				share = payment.amount / transaction.participants.length
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
