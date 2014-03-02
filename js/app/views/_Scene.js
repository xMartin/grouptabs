define([
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/_Container",
	"dijit/form/_FormMixin",
	"dijit/form/Button"
], function(_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _Container, _FormMixin){

return dojo.declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _Container, _FormMixin], {
	
	app: null,
	
	// controller: [viewController]
	controller: null,
	
	close: function(scene, message, params){
		this.controller.onSceneClosed(scene, message, params)
	},
	
	onShow: function(){}
})

})
