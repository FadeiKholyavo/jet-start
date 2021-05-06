/* eslint-disable no-undef */
import {JetApp, EmptyRouter, HashRouter, plugins} from "webix-jet";
import "./styles/app.css";

export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: true,
			start: "/top/contacts",
			views: {
				contacts: "contacts.contacts",
				"contacts-template": "contacts.contacts-template",
				"contacts-form": "contacts.contacts-form",
				activities: "activities.activities",
				settings: "settings.settings"
			}
		};

		super({...defaults, ...config});
	}
}

if (!BUILD_AS_MODULE) {
	webix.ready(() => {
		const app = new MyApp();
		app.attachEvent("app:error:resolve", () => {
			app.show("/top");
		});
		app.use(plugins.Locale);
		app.render();
	});
}
