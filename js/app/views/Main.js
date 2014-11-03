define([
	"ring",
	// "dojo/_base/declare",
	// "dojo/dom-construct",
	// "dojo/number",
	"react",
	"./_Scene",
	"../components/summary"
	// "dojo/text!./templates/Main.html"
], function(ring/*declare, domConstruct, number*/, React, _Scene, SummaryClass/*, template*/){

return ring.create([_Scene], {

	// templateString: template,

	name: "main",
	
	postCreate: function(){
		this.$super()
		this.summaryNode = this.domNode
		this._createComponents()
		this._renderSummary()
	},
	
	_createComponents: function(){
		this.summary = React.render(React.createFactory(SummaryClass)(), this.summaryNode)
	},

	_onChangeTabClick: function(){
		this.close(this, "tabs")
	},
	
	_onNewEntryClick: function(){
		this.close(this, "editEntry")
	},
	
	_onSummaryClick: function(){
		this.close(this, "summary")
	},
	
	_onListClick: function(){
		this.close(this, "list")
	},
	
	onShow: function(){
		this.app.setHomeView("main")
	},

	refresh: function(){
		// this.tabNameNode.innerHTML = this.app.tab
		this.refreshSummary()
	},
	
	refreshSummary: function(){
		this._renderSummary()
	},

	_setEmpty: function(isEmpty){
		// if(isEmpty){
		// 	this.contentNode.style.display = 'none'
		// 	this.emptyNode.style.display = ''
		// }else{
		// 	this.contentNode.style.display = ''
		// 	this.emptyNode.style.display = 'none'
		// }
	},

	_renderSummary: function(){
		this.app.getAccounts()
		.then(function(accounts){
			// this._clearSummary()
			this._setEmpty(!accounts.length)
			this.summary.setState({data: accounts})
		}.bind(this))
	},
	
	_clearSummary: function(){
		this.summaryNode.innerHTML = ""
	}
})

})
