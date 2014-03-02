define([
	"dojo/_base/declare",
	"dojo/_base/connect",
	"dojo/store/Memory",
	"./remoteStorageModule"
], function(declare, connect, memoryStore, remoteStorageModule){


return declare(null, {
	
	store: null,
	
	localStorageKey: "",
	
	dataArrayKey: "",
	
	constructor: function(args){
		this.store = new memoryStore
	},

	put: function(data){
		this.store.put(data)
		remoteStorageModule.saveTransaction(data.id, data)
	},
	
	remove: function(id){
		this.store.remove(id)
		remoteStorageModule.removeTransaction(id)
	}

})

})
