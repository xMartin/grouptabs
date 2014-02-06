define([
	"remotestorage",
	"gka/store/RemoteStorageAdapter",
	"gka/viewController",
	"gka/BoxView",
	"gka/MainView",
	"gka/NewEntryView",
	"gka/ListView"
], function(remoteStorage, RemoteStorageAdapter, viewController, BoxView, MainView, NewEntryView, ListView){

var remoteStorageAdapter = new RemoteStorageAdapter()
var store = remoteStorageAdapter.store

var obj = {
	
	box: localStorage.getItem("box") || "",

	store: store,

	init: function(){
		var viewName, view,
			views = {
				"box": new BoxView({app: obj, controller: viewController}),
				"main": new MainView({app: obj, controller: viewController}),
				"newEntry": new NewEntryView({app: obj, controller: viewController}),
				"list": new ListView({app: obj, controller: viewController})
			},
			initData = function(){
				remoteStorage.gruppenkasse.getTransactions().then(function(data){
					var items = []
					for(var id in data){
						items.push(data[id])
					}
					store.setData(items)
					viewController.refreshAll()

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
				viewController.refreshAll()
			},
			removeData = function(data){
				store.remove(data.id)
				viewController.refreshAll()
			},
			emptyData = function(){
				store.setData([])
				viewController.refreshAll()
				viewController.selectView(views["box"])
			}
		
		for(viewName in views){
			view = views[viewName]
			viewController.addView(view)
		}
		viewController.selectView(obj.box ? views["main"] : views["box"])
		
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
		store.query({"box": obj.box}).forEach(function(transaction){
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
	
	setBox: function(boxName){
		obj.box = boxName
		localStorage.setItem("box", boxName)
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
