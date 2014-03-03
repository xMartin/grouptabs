define([
	"./HoodieStoreAdapter",
	"./sceneController",
	"./views/Tabs",
	"./views/Main",
	"./views/EditEntry",
	"./views/TransactionList"
], function(HoodieStoreAdapter, sceneController, TabsScene, MainScene, EditEntryScene, TransactionListScene){

var hoodieStoreAdapter = new HoodieStoreAdapter()
var store = hoodieStoreAdapter.store

var obj = {
	
	tab: localStorage.getItem("box") || "",

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
				hoodie.store.findAll("transaction").then(function(data){
					store.setData(data)
					sceneController.refreshAll()

					hoodie.store.on("add:transaction", addData)
					hoodie.store.on("remove:transaction", removeData)
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
		
		initData()
		hoodie.account.on("signout", emptyData)
		hoodie.account.on("signin", initData)
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
	
	saveEntry: function(data){
		hoodieStoreAdapter.put(data)
	},
	
	deleteEntry: function(id){
		hoodieStoreAdapter.remove(id)
	}
}

return obj

})
