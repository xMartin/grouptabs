define([
	"./app"
], function(app){

var obj = {

	exportAllTabs: function(){
		hoodie.store.findAll("transaction").then(function(transactions){
			var result = {transactions: items}
			console.log(JSON.stringify(result))
		})
	},

	removeAllTabs: function(){
		hoodie.store.findAll("transaction").then(function(transactions){
			transactions.forEach(function(transaction){
				app.deleteEntry(transaction.id)
			})
		})
	},

	removeTab: function(box){
		if(!box){
			return
		}
		hoodie.store.findAll("transaction").then(function(transactions){
			transactions.forEach(function(transaction){
				if(transaction.box == box){
					app.deleteEntry(transaction.id)
				}
			})
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
