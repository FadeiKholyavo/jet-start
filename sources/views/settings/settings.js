import {JetView} from "webix-jet";

import activitiesTypes from "../../models/activities-type";
import statuses from "../../models/statuses";
import Datatable from "./settings-datatable";

export default class SettingsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();

		const ui = {
			rows: [
				{
					rows: [
						{},
						{
							view: "segmented",
							align: "center",
							options: [
								{id: "en", value: _("English")},
								{id: "ru", value: _("Russian")}
							],
							inputWidth: 400,
							label: `${_("Language")}:`,
							click: () => this.toggleLanguage(),
							value: lang
						},
						{}
					]
				},
				{
					view: "tabview",
					cells: [
						{
							header: _("ActivitiesTypes"),
							body: new Datatable(this.app, "", activitiesTypes, "ActivityType")
						},
						{
							header: _("Statuses"),
							body: new Datatable(this.app, "", statuses, "Status")
						}
					]
				}
			]
		};

		return ui;
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.getRoot().queryView({view: "segmented"}).getValue();
		langs.setLang(value);
		if (langs.getLang() === "en") {
			webix.i18n.setLocale("en-US");
		}
		else {
			webix.i18n.setLocale("ru-RU");
		}
	}
}
