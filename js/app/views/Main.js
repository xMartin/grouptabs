define([
	"ring",
	// "dojo/_base/declare",
	// "dojo/dom-construct",
	// "dojo/number",
	"react",
	"./_Scene",
	"../components/main"
	// "dojo/text!./templates/Main.html"
], function(ring/*declare, domConstruct, number*/, React, _Scene, MainComponentClass/*, template*/){

var MainComponent = React.createFactory(MainComponentClass)

return ring.create([_Scene], {

	// templateString: template,

	name: "main",
	
	postCreate: function(){
		this.$super()
		this.domNode.className = "scene mainScene"
		this.component = React.render(MainComponent({
			handleChangeTabClick: this._onChangeTabClick.bind(this),
			handleNewEntryClick: this._onNewEntryClick.bind(this),
			handleListClick: this._onListClick.bind(this)
		}), this.domNode)
		this._render()
	},

	_onChangeTabClick: function(){
		this.close(this, "tabs")
	},
	
	_onNewEntryClick: function(){
		this.close(this, "editEntry")
	},
	
	_onListClick: function(){
		this.close(this, "list")
	},
	
	onShow: function(){
		this.app.setHomeView("main")
	},

	refresh: function(){
		// this.tabNameNode.innerHTML = this.app.tab
		this._render()
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

	_render: function(){
		this.app.getAccounts()
		.then(function(accounts){
			this._setEmpty(!accounts.length)
			this.component.setState({tabName: this.app.tab, data: accounts})
		}.bind(this))
	}
})

})
