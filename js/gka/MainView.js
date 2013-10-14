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
				'transparent'
			}
			var isNegative = amount < 0
			amount = Math.abs(amount)
			var factor = amount / maxAmount
			var hue = isNegative ? 7 : 117  // red: 360, green: 120
			var saturation = '75%'
			var levelFactor = 0.8
			var level = Math.round(100 - factor * 50 * (1 - levelFactor + 1)) + '%'  // 50% is full color
			return "hsl(" + hue + ", " + saturation + ", " + level + ")"
		}
		var html = "<table>"
		accounts.forEach(function(accountObj){
			var amount = currency.format(accountObj.amount, {currency: "EUR"})
			html +=
				"<tr style='background-color: " + cssColor(accountObj.amount) + "'>"
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
