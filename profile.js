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
			name: "app",
			location: "js/app"
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
				"app/app"
			],
			includeLocales: ["en", "en-us", "de"]
		}
	}
}
