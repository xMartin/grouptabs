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
			var maxAmount = (function(){
				var result = 0
				accounts.forEach(function(account){
					var amount = Math.abs(account.amount)
					if(amount > result){
						result = amount
					}
				})
				return Math.round(result * 100) / 100
			})()
			var cssColor = function(amount){
				if(!maxAmount){
					return 'transparent'
				}
				var color = amount < 0 ? [226, 91, 29] : [92, 226, 14]
				var opacity = Math.abs(amount) / maxAmount
				color.push(opacity)
				return "rgba(" + color.join(",") + ")"
			}
			var data = []
			accounts.forEach(function(account){
				data.push({
					amount: /*number.format(*/account.amount/*, {places: 2})*/,
					cssColor: cssColor(account.amount),
					participant: account.participant
				})
			})
			this.summary.setState({data: data})
		}.bind(this))
	},
	
	_clearSummary: function(){
		this.summaryNode.innerHTML = ""
	}
})

})
