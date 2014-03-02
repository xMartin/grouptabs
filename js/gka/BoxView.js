define([
	"./_View",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dojo/text!./templates/BoxView.html"
], function(_View, lang, domClass, Button, ValidationTextBox, template){

return dojo.declare(_View, {

	templateString: template,

	name: "box",

	constructor: function(){
		this._boxButtons = []
	},

	postCreate: function(){
		this._createBoxButtons()
	},

	refresh: function(){
		this._boxButtons.forEach(function(boxButton){
			boxButton.destroy()
		})
		this._boxButtons = []
		this._createBoxButtons()
		if(this._getBoxes().length){
			this.noBoxesNode.style.display = 'none'
		}else{
			this.noBoxesNode.style.display = ''
		}
	},

	_createBoxButtons: function(){
		this._getBoxes().forEach(function(boxName){
			var button = new Button({label: boxName})
			domClass.add(button.domNode, "full-width")
			button.onClick = lang.hitch(this, function(){
				this._onBoxClick(boxName)
			})
			button.placeAt(this.boxesNode)
			this._boxButtons.push(button)
		}, this)
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

	_setBox: function(boxName){
		this.app.setBox(boxName)
	},

	_onBoxClick: function(boxName){
		this._setBox(boxName)
		this.close(this, "main")
	},

	_onOkClick: function(){
		var newBoxName = this.newBoxTextBox.get("value")
		this._setBox(newBoxName)
		this.newBoxTextBox.set("value", "")
		this.close(this, "main")
	}
})

})
