define([
	"gka/store/LocalStorageAdapter"
], function(LSA){

var store = new LSA({localStorageKey: "badminton", dataArrayKey: "transactions"}).store

return {
	
	store: store,
	
	refreshData: function(){
		var xhr = new XMLHttpRequest()
		xhr.open("GET", "data/badminton.json?nocache=" + (new Date()).getTime(), true);
		xhr.onreadystatechange = function(){
			var data
			if(xhr.readyState == 4 && xhr.status == 200){
				data = xhr.responseText
				store.setData(JSON.parse(data).transactions)
				localStorage.setItem("badminton", data)
				alert("Daten erfolgreich geladen.")
			}
		}
		xhr.send()
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
		transactions.forEach(function(transaction){
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
	
	saveEntry: function(data){
		store.put(data)
	},
	
	deleteEntry: function(id){
		store.remove(id)
	}
}

})
