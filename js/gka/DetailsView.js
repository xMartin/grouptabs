define([
	"gka/_View",
	"gka/DetailsDisplay",
	"dijit/form/Button",
	"dojo/text!./templates/DetailsView.html"
], function(_View, DetailsDisplay, Button, template){

return dojo.declare(_View, {
	
	templateString: template,
	
	name: "details",
	
	//	id: String
	//		Id of the corresponding data item.
	entryId: "",
	
	onShow: function(params){
		this.entryId = params.entryId
		params.app = this.app
		this.detailsDisplay = new DetailsDisplay(params).placeAt(this.detailsDisplayNode)
	},
	
	_onBackClick: function(){
		this._cleanup()
		this.close(this, "list")
	},
	
	_onDeleteClick: function(){
		this.app.deleteEntry(this.entryId)
		this._cleanup()
		this.close(this, "list")		
	},
	
	_cleanup: function(){
		this.detailsDisplay.destroyRecursive()
	}
})

})
