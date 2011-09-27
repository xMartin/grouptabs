define([
	"gka/_View",
	"gka/app",
	"dojo/text!./templates/MainView.html"
], function(_View, app, template){

return dojo.declare(_View, {
	
	templateString: template,
	
	name: "main",
	
	_onRefreshDataClick: function(){
		app.refreshData()
	},
	
	_onSaveDataClick: function(){
		app.postData()
	},
	
	_onNewEntryClick: function(){
		this.close(this, "newEntry")
	},
	
	_onSummaryClick: function(){
		this.close(this, "summary")
	}
})

})
