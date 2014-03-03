define([
	"dojo/_base/declare",
	"dojo/_base/connect",
	"dojo/store/Memory"
], function(declare, connect, memoryStore){


return declare(null, {

	store: null,

	constructor: function(args){
		this.store = new memoryStore
	},

	put: function(data){
		this.store.put(data)
		hoodie.store.add("transaction", data)
	},

	remove: function(id){
		this.store.remove(id)
		hoodie.store.remove("transaction", id)
	}

})

})
