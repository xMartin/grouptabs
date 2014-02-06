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
			name: "remotestorage",
			location: "js/remotestorage"
		}
	],
	layers: {
		"dojo/dojo": {
			include: [
				"dojo/selector/acme",
				"gka/app"
			],
			includeLocales: ["en", "en-us", "de"]
		}
	}
}
