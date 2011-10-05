define(function(){

var viewController = {
	views: []
}

var getViewByName = function(viewName){
	var view
	viewController.views.forEach(function(_view){
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
		date: data.date.toUTCString(),
		participants: participants,
		payments: payments
	})
	localStorage.setItem("badminton", dojo.toJson({transactions: transactions}))
}

return {
	viewController: viewController,
	
	addView: function(view){
		view.placeAt(dojo.byId("views"))
		viewController.views.push(view)
	},

	selectView: function(view){
		viewController.views.forEach(function(_view){
			dojo.style(_view.domNode, "display", "none")
		})
		if(typeof view == "string"){
			view = getViewByName(view)
		}
		dojo.style(view.domNode, "display", "")
		view.onShow()
		viewController.selectedView = view
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
