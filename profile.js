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
