define(function(){

var client
var userInfo

function login(callback){
	client = new Dropbox.Client({
		key: "XXX",
		secret: "XXX",
		sandbox: true
	})
	client.authDriver(new Dropbox.Drivers.Redirect())
	client.authenticate(function(error){
		client.getUserInfo(function(error, data){
			userInfo = data
			callback(client)
		})
	})
}

function sync(){
	function fileWrittenCallback(error, stat){
		console.log("File '" + stat.name + "' saved as revision " + stat.revisionTag + ".")
	}
	for(var i in localStorage){
		if(i.indexOf("gka_transaction_") === 0){
			client.writeFile(i + ".json", localStorage.getItem(i), fileWrittenCallback)
		}
	}
}

return {
	getUserInfo: function(){
		return userInfo
	},
	login: login,
	sync: sync
}

})
