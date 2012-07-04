define([
	"dojo/_base/declare",
	"dojo/_base/connect",
	"dojo/store/Memory"
], function(declare, connect, memoryStore){


return declare(null, {
	
	store: null,
	
	localStorageKey: "",
	
	dataArrayKey: "",
	
	constructor: function(args){
		var prefix = this.prefix = args.prefix
		var items = []
		for(var i = 0, l = localStorage.length; i < l; ++i){
			var key = localStorage.key(i)
			if(key.indexOf(prefix) === 0){
				items.push(JSON.parse(localStorage.getItem(key)))
			}
		}
		this.store = new memoryStore({data: items})
		this._connects = [
			connect.connect(this.store, "put", this, "put"),
			connect.connect(this.store, "remove", this, "remove")
		]
	},
	
	put: function(data){
		localStorage.setItem(this.prefix + data.id, JSON.stringify(data))
	},
	
	remove: function(id){
		localStorage.removeItem(this.prefix + id)
	}

})

})
