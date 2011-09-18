define([
	"gka/_View"
], function(){

return dojo.declare(
	"gka.MainView",
	[gka._View],
{
	templateString: dojo.cache("gka", "templates/MainView.html"),
	
	name: "main",
	
	_onNewEntryClick: function(){
		this.close(this, "newEntry")
	},
	
	_onSummaryClick: function(){
		this.close(this, "summary")
	}
})

})
