define([
	"gka/_View",
	"gka/app"
], function(_View, app){

return dojo.declare(
	"gka.MainView",
	[gka._View],
{
	templateString: dojo.cache("gka", "templates/MainView.html"),
	
	name: "main",
	
	_onRefreshDataClick: function(){
		app.refreshData()
	},
	
	_onNewEntryClick: function(){
		this.close(this, "newEntry")
	},
	
	_onSummaryClick: function(){
		this.close(this, "summary")
	}
})

})
