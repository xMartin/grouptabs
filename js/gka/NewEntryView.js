define([
	"gka/_View"
], function(){

return dojo.declare(
	"gka.NewEntryView",
	[gka._View],
{
	templateString: dojo.cache("gka", "templates/NewEntryView.html"),
	
	name: "newEntry",
	
	_onOkClick: function(){
		this.close(this, "main")
	}

})

})
