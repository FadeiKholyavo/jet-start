/* eslint-disable no-undef */
import {JetApp, EmptyRouter, HashRouter} from "webix-jet";
import "./styles/app.css";

export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: true,
			start: "/top/start"
		};

		super({...defaults, ...config});
	}
}

if (!BUILD_AS_MODULE) {
	webix.ready(() => {
		const app = new MyApp();
		app.attachEvent("app:error:resolve", function() {
			app.show("/top");
		});
		app.render()
	});
}
