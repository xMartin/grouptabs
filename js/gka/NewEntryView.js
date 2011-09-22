define([
	"gka/_View",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox"
], function(){

return dojo.declare(
	"gka.NewEntryView",
	[gka._View],
{
	templateString: dojo.cache("gka", "templates/NewEntryView.html"),
	
	name: "newEntry",
	
	_onOkClick: function(){
		var params = this.get("value")
		this.reset()
		this.close(this, "main", params)
	},
	
	_onCancelClick: function(){
		this.reset()
		this.close(this, "main")
	}
})

})
