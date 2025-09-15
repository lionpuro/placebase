import { createApiReference } from "@scalar/api-reference";
createApiReference("#scalar", {
	url: "/api/openapi.json",
	theme: "alternate",
	defaultOpenAllTags: true,
	withDefaultFonts: false,
	forceDarkModeState: "light",
	hideDarkModeToggle: true,
	onLoaded: () => document.querySelector("#scalar")?.classList.remove("hidden"),
});
