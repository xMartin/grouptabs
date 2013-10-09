define([
	"dojo/dom-construct",
	"dojo/currency",
	"gka/_View",
	"dojo/text!./templates/MainView.html"
], function(domConstruct, currency, _View, template){

return dojo.declare(_View, {
	
	templateString: template,
	
	name: "main",
	
	postCreate: function(){
		this._renderSummary()
	},
	
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
		this.refresh()
	},

	refresh: function(){
		this.boxNameNode.innerHTML = this.app.box
		this.refreshSummary()
	},
	
	refreshSummary: function(){
		this._clearSummary()
		this._renderSummary()
	},
	
	_renderSummary: function(){
		var accounts = (function(accountsObj){
			var result = []
			for(var accountName in accountsObj){
				var resultObj = {}
				resultObj.account = accountName
				resultObj.amount = accountsObj[accountName]
				result.push(resultObj)
			}
			result.sort(function(a, b){
				return a.amount < b.amount ? -1 : 1
			})
			return result
		})(this.app.getAccounts())
		var html = "<table>"
		accounts.forEach(function(accountObj, idx){
			var amount = currency.format(accountObj.amount, {currency: "EUR"})
			html +=
				"<tr class='" + (idx % 2 == 0 ? "even" : "odd") + "'>"
				+ "<th class='account'>" + accountObj.account + ": </th>"
				+ "<td class='amount'>" + amount + "</td>"
				+ "</tr>"
		})
		html += "</table>"
		this.summaryNode.appendChild(domConstruct.toDom(html))
	},
	
	_clearSummary: function(){
		domConstruct.empty(this.summaryNode)
	}
})

})
