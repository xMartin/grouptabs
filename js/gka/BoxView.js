define([
	"gka/_View",
	"dijit/registry",
	"dijit/form/RadioButton",
	"dijit/form/ValidationTextBox",
	"dojo/_base/connect",
	"dojo/query",
	"dojo/dom-construct",
	"dojo/_base/lang",
	"dojo/text!./templates/BoxView.html"
], function(_View, dijitRegistry, RadioButton, ValidationTextBox, connect, domQuery, domConstruct, lang, template){

return dojo.declare(_View, {
	
	templateString: template,
	
	name: "box",
	
	constructor: function(){
		this._boxOptionsConnects = []
	},
	
	postCreate: function(){
		this._createBoxChooser()
	},
	
	refresh: function(){
		this.getChildren().forEach(function(w){
			if(w.id.indexOf("boxRadioButton_") === 0){
				w.destroy()
			}
		})
		this._boxOptionsConnects.forEach(function(c){
			connect.disconnect(c)
		})
		domQuery(".row._dynamic").forEach(function(n){
			domConstruct.destroy(n)
		})
		this._createBoxChooser()
	},
	
	_createBoxChooser: function(){
		this._boxOptionInsertNode = this.boxChooserHeadingNode
		this._boxOptionCount = 0
		this._getBoxes().forEach(this._addBoxOption, this)
	},
	
	_addBoxOption: function(boxName){
		var rowNode = domConstruct.create("div", {"class": "row _dynamic"})
		var radioButton = new RadioButton({id: "boxRadioButton_" + this._boxOptionCount, name: "box", value: boxName}).placeAt(rowNode)
		this.app.box == boxName && radioButton.set("checked", true)
		domConstruct.create("label", {"for": "boxRadioButton_" + this._boxOptionCount, innerHTML: boxName}, rowNode)
		domConstruct.place(rowNode, this._boxOptionInsertNode, "after")
		this._boxOptionsConnects.push(
			connect.connect(rowNode, "onclick", function(evt){
				radioButton._onClick(evt)
			})
		)
		this._boxOptionInsertNode = rowNode
		this._boxOptionCount++
	},
	
	_selectNewBox: function(){
		dijitRegistry.byId("newBoxOption").set("checked", true)
	},
	
	_getBoxes: function(){
		var boxes = []
		this.app.store.query(function(){return true}).forEach(function(t){
			if(t.box && boxes.indexOf(t.box) === -1){
				boxes.push(t.box)
			}
		})
		return this._boxes = boxes
	},
	
	_addBox: function(boxName){
		this._boxes.push(boxName)
	},
	
	_setBox: function(boxName){
		this.app.setBox(boxName)
	},
	
	_onOkClick: function(){
		var values = this.getValues()
		if(values.box == "newBox"){
			this._addBoxOption(values.newBoxName)
			this._setBox(values.newBoxName)
			dijitRegistry.byId("boxRadioButton_" + (this._boxOptionCount - 1)).set("checked", true)
			dijitRegistry.byId("newBoxInput").set("value", "")
		}else{
			this._setBox(values.box)
		}
		this.close(this, "main")
	},
	
	_onRefreshDataClick: function(){
		this.app.refreshData().then(lang.hitch(this, this.refresh))
	},
	
	_onSaveDataClick: function(){
		this.app.postData()
	}
})

})
