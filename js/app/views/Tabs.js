define([
	"./_Scene",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dojo/text!./templates/Tabs.html"
], function(_Scene, declare, lang, domClass, Button, ValidationTextBox, template){

return declare(_Scene, {

	templateString: template,

	name: "tabs",

	constructor: function(){
		this._tabButtons = []
	},

	postCreate: function(){
		this._createTabButtons()
	},

	refresh: function(){
		this._tabButtons.forEach(function(tabButton){
			tabButton.destroy()
		})
		this._tabButtons = []
		this._createTabButtons()
		if(this._getTabs().length){
			this.noTabsNode.style.display = 'none'
		}else{
			this.noTabsNode.style.display = ''
		}
	},

	_createTabButtons: function(){
		this._getTabs().forEach(function(tabName){
			var button = new Button({label: tabName})
			domClass.add(button.domNode, "full-width")
			button.onClick = lang.hitch(this, function(){
				this._onTabClick(tabName)
			})
			button.placeAt(this.tabsNode)
			this._tabButtons.push(button)
		}, this)
	},

	_getTabs: function(){
		var tabs = []
		this.app.store.query(function(){return true}).forEach(function(transaction){
			if(transaction.box && tabs.indexOf(transaction.box) === -1){
				tabs.push(transaction.box)
			}
		})
		return this._tabs = tabs
	},

	_setTab: function(tabName){
		this.app.setTab(tabName)
	},

	_onTabClick: function(tabName){
		this._setTab(tabName)
		this.close(this, "main")
	},

	_onOkClick: function(){
		var newTabName = this.newTabTextBox.get("value")
		this._setTab(newTabName)
		this.newTabTextBox.set("value", "")
		this.close(this, "main")
	}
})

})
