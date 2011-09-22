define({

getData: function(){
	return dojo.fromJson(localStorage.getItem("badminton"))
},

refreshData: function(){
	var xhr = new XMLHttpRequest()
	xhr.open("GET", "data/badminton.json?nocache=" + (new Date()).getTime(), true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			localStorage.setItem("badminton", xhr.responseText)
			alert("Data refreshed successfully.")
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
				alert("Uploaded successfully.")
			}else{
				alert("Error.")
			}
		},
		error: function(error){
			alert("Error: " + error)
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
}

})
