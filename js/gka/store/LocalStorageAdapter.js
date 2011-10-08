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
		var data, items = []
		this.localStorageKey = args.localStorageKey
		this.dataArrayKey = args.dataArrayKey
		data = localStorage.getItem(args.localStorageKey)
		if(data){
			items = JSON.parse(data)[args.dataArrayKey]
		}
		this.store = new memoryStore({data: items})
		this._connects = [
			connect.connect(this.store, "put", this, "_save"),
			connect.connect(this.store, "remove", this, "_save")
		]
	},
	
	_save: function(){
		var obj = {}
		obj[this.dataArrayKey] = this.store.data
		localStorage.setItem(this.localStorageKey, JSON.stringify(obj))
	}

})

})
