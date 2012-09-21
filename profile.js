var profile = {
	packages: [
		{
			name: "dojo",
			location: "js/dojo"
		},
		{
			name: "dijit",
			location: "js/dijit"
		},
		{
			name: "gka",
			location: "js/gka"
		},
		{
			name: "remote-storage",
			location: "js/remote-storage"
		}
	],
	layers: {
		"dojo/dojo": {
			include: [
				"dojo/selector/acme",
				"gka/app"
			]
		}
	}
}
