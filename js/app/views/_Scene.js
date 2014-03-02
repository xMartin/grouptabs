define([
	"dojo/_base/declare",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/_Container",
	"dijit/form/_FormMixin",
	"dijit/form/Button"
], function(declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _Container, _FormMixin){

return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _Container, _FormMixin], {
	
	app: null,
	
	// controller: [viewController]
	controller: null,
	
	close: function(scene, message, params){
		this.controller.onSceneClosed(scene, message, params)
	},
	
	onShow: function(){}
})

})
