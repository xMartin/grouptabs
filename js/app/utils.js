define([
	"./app"
], function(app){

var obj = {

	exportAllTabs: function(){
		remoteStorage.gruppenkasse.getTransactions().then(function(transactions){
			var items = []
			for(var id in transactions){
				items.push(transactions[id])
			}
			var result = {transactions: items}
			console.log(JSON.stringify(result))
		})
	},

	removeAllTabs: function(){
		remoteStorage.gruppenkasse.getTransactions().then(function(transactions){
			for(var id in transactions){
				app.deleteEntry(id)
			}
		})
	},

	removeTab: function(box){
		if(!box){
			return
		}
		remoteStorage.gruppenkasse.getTransactions().then(function(transactions){
			for(var id in transactions){
				if(transactions[id].box == box){
					app.deleteEntry(id)
				}
			}
		})
	},

	importFromJson: function(data){
		// data: JSON string like
		// | '{
		// | 	"transactions": [
		// |	    {
		// |	      "date": 1297033200000,
		// |	      "id": "0000000000000",
		// |	      "participants": [
		// |	        "Martin",
		// |	        "Dominik",
		// |	        "Simon"
		// |	      ],
		// |	      "payments": [
		// |	        {
		// |	          "amount": 13.5,
		// |	          "participant": "Dominik"
		// |	        }
		// |	      ],
		// |	      "title": "Badminton",
		// |	      "type": "spending",
		// |	      "box": "Badminton"
		// |	    },"

		data = JSON.parse(data)
		var transactions = data.transactions
		transactions.forEach(function(transaction){
			app.saveEntry(transaction)
		})
	}

}

return obj

})
