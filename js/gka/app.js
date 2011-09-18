define({

getData: function(){
	return JSON.parse(localStorage.getItem("badminton"))
},

refreshData: function(){
	var xhr = new XMLHttpRequest()
	xhr.open("GET", "localStorage/Badminton.json", true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			localStorage.setItem("badminton", xhr.responseText)
		}
	}
	xhr.send()
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
}

})
