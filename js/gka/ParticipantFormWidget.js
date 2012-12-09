define([
	"dijit/_Widget",
	"dijit/form/ComboBox",
	"dijit/form/NumberTextBox",
	"dijit/form/Button",
	"dojo/store/Memory"
], function(_Widget, ComboBox, NumberTextBox, Button, MemoryStore){

return dojo.declare([_Widget], {
	
	baseClass: "participantInput",
	
	// make this a form-compatible widget
	value: null,
	name: "",
	
	constructor: function(){
		this.value = {}
	},
	
	postCreate: function(){
		var domNode = this.domNode
		this.comboBox = new ComboBox({
			name: "participant",
			store: new MemoryStore({data: this.participants}),
			searchAttr: "id",
			onChange: dojo.hitch(this, this._onComboBoxChange)
		}).placeAt(domNode)
		this.textBox = new NumberTextBox({
			name: "amount",
			placeholder: dojo.number.format(0, {places: 2}),
			onChange: dojo.hitch(this, this._onTextBoxChange)
		}).placeAt(domNode)
		new Button({
			label: "-",
			onClick: dojo.hitch(this, this._onRemoveClick)
		}).placeAt(domNode)
	},
	
	_onRemoveClick: function(){
		this.onRemoveClick(this)
	},
	
	onRemoveClick: function(widget){},
	
	_onComboBoxChange: function(){
		this.value.participant = this.comboBox.get("value")
	},
	
	_onTextBoxChange: function(){
		this.value.amount = this.textBox.get("value")
	},
	
	reset: function(){
		this.comboBox.reset()
		this.textBox.reset()
	}
	
})

})
