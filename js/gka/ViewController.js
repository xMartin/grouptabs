define(function(){

window.viewController = {
	views: []
}

var getViewByName = function(viewName){
	var view
	window.viewController.views.forEach(function(_view){
		if(_view.name == viewName){
			view = _view
			return
		}
	})
	return view
}

var saveEntry = function(data){
	console.log(data)
	var participants = data.participants.split(",")
	var payments = []
	data.payments.split(",").forEach(function(payment){
		var p = payment.split(":")
		payments.push({participant: p[0], amount: parseFloat(p[1])})
	})
	
	var transactions = dojo.fromJson(localStorage.getItem("badminton")).transactions
	transactions.push({
		type: "spending",
		title: data.title,
		date: data.date,
		participants: participants,
		payments: payments
	})
	localStorage.setItem("badminton", dojo.toJson({transactions: transactions}))
}

return {
	addView: function(view){
		view.placeAt(dojo.byId("views"))
		window.viewController.views.push(view)
	},

	selectView: function(view){
		window.viewController.views.forEach(function(_view){
			dojo.style(_view.domNode, "display", "none")
		})
		if(typeof view == "string"){
			view = getViewByName(view)
		}
		dojo.style(view.domNode, "display", "")
		view.onShow()
		window.viewController.selectedView = view
	},
	
	onViewClosed: function(view, message, params){
		switch(view.name){
			case "newEntry":
				params && saveEntry(params)
		}
		this.selectView(message)
	}
}

})
