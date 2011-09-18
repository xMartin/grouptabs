define([
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin"
], function(){

dojo.declare(
	"gka._View",
	[dijit._Widget, dijit._TemplatedMixin, dijit._WidgetsInTemplateMixin],
{
	// controller: [gka.ViewController]
	controller: null,
	
	close: function(view, message){
		this.controller.onViewClosed(view, message)
	}
})

})
