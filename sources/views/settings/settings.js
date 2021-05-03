import {JetView} from "webix-jet";

import Datatable from "./settings-datatable";
import statuses from "../../models/statuses";
import activitiesTypes from "../../models/activities-type";

export default class SettingsView extends JetView {
	config() {

        const ui = {
            rows:[
                {},
                {
                    view: "tabview",
						cells: [
							{
								header: "Activities types",
								body: new Datatable(this.app, "", activitiesTypes, "activity type")
							},
							{
								header: "Statuses",
								body: new Datatable(this.app, "", statuses, "status")
							}
						]
                }
            ]
        }

        return ui
    }
}
