define([
	"dojo/dom",
	"dojo/dom-style"
], function(dom, domStyle){

var sceneController = {
	scenes: []
}

var getSceneByName = function(sceneName){
	var scene
	sceneController.scenes.forEach(function(_scene){
		if(_scene.name == sceneName){
			scene = _scene
			return
		}
	})
	return scene
}

return {
	sceneController: sceneController,

	refreshAll: function(){
		sceneController.scenes.forEach(function(scene){
			scene.refresh && scene.refresh()
		})
	},
	
	addScene: function(scene){
		scene.placeAt(dom.byId("scenes"))
		sceneController.scenes.push(scene)
	},

	selectScene: function(scene, params){
		sceneController.scenes.forEach(function(_scene){
			domStyle.set(_scene.domNode, "display", "none")
		})
		if(typeof scene == "string"){
			scene = getSceneByName(scene)
		}
		domStyle.set(scene.domNode, "display", "")
		scene.onShow(params)
		sceneController.selectedScene = scene
	},
	
	onSceneClosed: function(scene, message, params){
		this.selectScene(message, params)
	}
}

})
