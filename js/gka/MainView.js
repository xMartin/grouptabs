define([
	"gka/_View",
	"dojo/text!./templates/MainView.html"
], function(_View, template){

return dojo.declare(_View, {
	
	templateString: template,
	
	name: "main",
	
	_onChangeBoxClick: function(){
		this.close(this, "box")
	},
	
	_onNewEntryClick: function(){
		this.close(this, "newEntry")
	},
	
	_onSummaryClick: function(){
		this.close(this, "summary")
	},
	
	_onListClick: function(){
		this.close(this, "list")
	},
	
	onShow: function(){
		this.boxNameNode.innerHTML = this.app.box
	}
})

})
