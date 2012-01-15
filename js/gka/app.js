define([
	"gka/store/LocalStorageAdapter",
	"gka/viewController",
	"gka/BoxView",
	"gka/MainView",
	"gka/NewEntryView",
	"gka/ListView",
	"gka/DetailsView",
	"dojo/_base/xhr",
	"dojo/json"
], function(LSA, viewController, BoxView, MainView, NewEntryView, ListView, DetailsView, xhr, json){

var store = new LSA({localStorageKey: "badminton", dataArrayKey: "transactions"}).store

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
			}
		
		for(viewName in views){
			view = views[viewName]
			viewController.addView(view)
		}
		viewController.selectView(obj.box ? views["main"] : views["box"])
	},
	
	refreshData: function(){
		var def = xhr.get({
			url: "data/badminton.json",
			preventCache: true,
			load: function(data){
				store.setData(json.parse(data).transactions)
				localStorage.setItem("badminton", data)
			}
		})
		def.addCallback(function(){
			alert("Daten erfolgreich geladen.")
		})
		def.addErrback(function(){
			alert("Fehler beim Daten laden.")
		})
		return def
	},
	
	postData: function(){
		dojo.xhrPost({
			url: "save.php",
			postData: "data=" + localStorage.getItem("badminton"),
			handleAs: "text",
			load: function(data){
				if(data == "success"){
					alert("Erfolgreich hochgeladen.")
				}else{
					alert("Fehler.")
				}
			},
			error: function(error){
				alert("Fehler: " + error)
			}
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
