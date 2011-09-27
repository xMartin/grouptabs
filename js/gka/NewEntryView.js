define([
	"gka/_View",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"dojo/text!./templates/NewEntryView.html"
], function(_View, ValidationTextBox, DateTextBox, template){

return dojo.declare(
	"gka.NewEntryView",
	[gka._View],
{
	templateString: template,
	
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
