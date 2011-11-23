define([
	"gka/_View",
	"dijit/form/RadioButton",
	"dijit/form/ValidationTextBox",
	"dojo/query",
	"dojo/dom-construct",
	"dojo/_base/lang",
	"dojo/text!./templates/BoxView.html"
], function(_View, RadioButton, ValidationTextBox, domQuery, domConstruct, lang, template){

return dojo.declare(_View, {
	
	templateString: template,
	
	name: "box",
	
	postCreate: function(){
		this._createBoxChooser()
	},
	
	refresh: function(){
		this.getChildren().forEach(function(w){
			if(w.id.indexOf("boxRadioButton_") === 0){
				w.destroy()
			}
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
		var rowNode = dojo.create("div", {"class": "row _dynamic"})
		new dijit.form.RadioButton({id: "boxRadioButton_" + this._boxOptionCount, name: "box", value: boxName}).placeAt(rowNode)
		dojo.create("label", {"for": "boxRadioButton_" + this._boxOptionCount, innerHTML: boxName}, rowNode)
		dojo.place(rowNode, this._boxOptionInsertNode, "after")
		this._boxOptionInsertNode = rowNode
		this._boxOptionCount++
	},
	
	_selectNewBox: function(){
		dijit.byId("newBoxOption").set("checked", true)
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
		this.app.box = boxName
	},
	
	_onOkClick: function(){
		var values = this.getValues()
		if(values.box == "newBox"){
			this._addBoxOption(values.newBoxName)
			this._setBox(values.newBoxName)
			dijit.byId("boxRadioButton_" + (this._boxOptionCount - 1)).set("checked", true)
			dijit.byId("newBoxInput").set("value", "")
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
