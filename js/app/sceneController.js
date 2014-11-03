define(function(){

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
		scene.placeAt(document.getElementById("scenes"))
		sceneController.scenes.push(scene)
	},

	selectScene: function(scene, params){
		sceneController.scenes.forEach(function(_scene){
			_scene.domNode.style.display = "none"
		})
		if(typeof scene == "string"){
			scene = getSceneByName(scene)
		}
		scene.domNode.style.display = ""
		scene.onShow(params)
		sceneController.selectedScene = scene
	},
	
	onSceneClosed: function(scene, message, params){
		this.selectScene(message, params)
	}
}

})
