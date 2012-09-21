define([
	"remote-storage/remoteStorage"
], function(remoteStorage){

var moduleName = "gruppenkasse-simple"

remoteStorage.defineModule(moduleName, function(privateClient, publicClient){
	
	privClient.sync("")
	
	return {
		
		name: moduleName,
		
		exports: {
			
			getTransactions: function(){
				var prefix = "transactions/"
				var keys = privateClient.getListing(prefix)
				return keys.map(function(key){
					return privateClient.getObject(prefix + key)
				})
			},
			
			saveTransaction: function(key, data){
				privateClient.storeObject("transaction", "transactions/" + key, data)
			},
			
			removeTransaction: function(key){
				privateClient.remove("transactions/" + key)
			}
		}
	}

})

return remoteStorage[moduleName]

})
