define([
	"dojo/_base/declare",
	"dojo/_base/connect",
	"dojo/store/Memory",
	"../remoteStorageModule"
], function(declare, connect, memoryStore, remoteStorageModule){


return declare(null, {
	
	store: null,
	
	localStorageKey: "",
	
	dataArrayKey: "",
	
	constructor: function(args){
		var items = remoteStorageModule.getTransactions()
		this.store = new memoryStore({data: items})
		this._connects = [
			connect.connect(this.store, "put", this, "put"),
			connect.connect(this.store, "remove", this, "remove")
		]
	},
	
	put: function(data){
		remoteStorageModule.saveTransaction(data.id, JSON.stringify(data))
	},
	
	remove: function(id){
		remoteStorageModule.removeTransaction(id)
	}

})

})
