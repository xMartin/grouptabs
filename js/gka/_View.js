define([
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/_Container",
	"dijit/form/_FormMixin",
	"dijit/form/Button"
], function(_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _Container, _FormMixin){

return dojo.declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _Container, _FormMixin], {
	
	// app: [gka.app]
	app: null,
	
	// controller: [gka.ViewController]
	controller: null,
	
	close: function(view, message, params){
		this.controller.onViewClosed(view, message, params)
	},
	
	onShow: function(){}
})

})
