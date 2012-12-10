define([
	"gka/store/RemoteStorageAdapter",
	"gka/viewController",
	"gka/BoxView",
	"gka/MainView",
	"gka/NewEntryView",
	"gka/ListView",
	"gka/DetailsView",
	"remote-storage/remoteStorage"
], function(RemoteStorageAdapter, viewController, BoxView, MainView, NewEntryView, ListView, DetailsView, remoteStorage){

var store = new RemoteStorageAdapter().store

var obj = {
	
	box: localStorage.getItem("box") || "",

	store: store,

	init: function(){
		var viewName, view,
			views = {
				"box": new BoxView({app: obj, controller: viewController}),
				"main": new MainView({app: obj, controller: viewController}),
				"newEntry": new NewEntryView({app: obj, controller: viewController}),
				"list": new ListView({app: obj, controller: viewController}),
				"details": new DetailsView({app: obj, controller: viewController})
			},
			refreshData = function(){
				remoteStorage.gruppenkasse.getTransactions().then(function(data){
					var items = []
					for(var id in data){
						items.push(data[id])
					}
					store.setData(items)
					viewController.refreshAll()
				})
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
		remoteStorage.claimAccess("gruppenkasse", "rw").then(function(){
			remoteStorage.displayWidget("remotestorage-connect")
			refreshData()
			
			remoteStorage.gruppenkasse.on("change", function(event){
				console.log(event.origin, "event")
				if(event.newValue && event.oldValue){
					console.log(event.path + " was updated")
				}else if(event.newValue){
					console.log(event.path + " was created")
				}else if(event.oldValue){
					console.log(event.path + " was deleted")
				}
				refreshData()
			})
			
			remoteStorage.onWidget("state", function(state){
				if(state == "disconnected"){
					emptyData()
				}
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
		store.put(data)
	},
	
	deleteEntry: function(id){
		store.remove(id)
	}
}

return obj

})
