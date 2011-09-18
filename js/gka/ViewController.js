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
		window.viewController.selectedView = view
	},
	
	onViewClosed: function(view, message){
		switch(view.name){
			case "XXX":
				break;
			default:
				console.log("Select view '" + message + "'.")
				this.selectView(message)
		}
	}
}

})
