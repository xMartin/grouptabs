define([
	"ring"
	// "dojo/_base/declare",
	// "dijit/_Widget",
	// "dijit/_TemplatedMixin",
	// "dijit/_WidgetsInTemplateMixin",
	// "dijit/_Container",
	// "dijit/form/_FormMixin",
	// "dijit/form/Button"
], function(ring/*declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _Container, _FormMixin*/){

return ring.create(/*[_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _Container, _FormMixin], */{
	app: null,
	
	// controller: [viewController]
	controller: null,
	
	constructor: function(options){
		for(var option in options){
			this[option] = options[option]
		}
		this.postCreate()
	},

	postCreate: function(){
		this.domNode = document.createElement("div")
	},

	placeAt: function(node){
		node.appendChild(this.domNode)
	},

	close: function(scene, message, params){
		this.controller.onSceneClosed(scene, message, params)
	},
	
	onShow: function(){}
})

})
