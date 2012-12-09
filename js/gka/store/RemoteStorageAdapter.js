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
		var _this = this
		_this.store = new memoryStore
		_this._connects = [
			connect.connect(_this.store, "put", _this, "put"),
			connect.connect(_this.store, "remove", _this, "remove")
		]
		remoteStorageModule.getTransactions().then(function(data){
			var items = []
			for(var id in data){
				items.push(data[id])
			}
			_this.store.setData(items)
		})
	},
	
	put: function(data){
		remoteStorageModule.saveTransaction(data.id, data)
	},
	
	remove: function(id){
		remoteStorageModule.removeTransaction(id)
	}

})

})
