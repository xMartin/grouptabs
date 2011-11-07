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
