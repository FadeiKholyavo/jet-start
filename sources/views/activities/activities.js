import {JetView} from "webix-jet";

import activities from "../../models/activities";
import ActivitiesAddButton from "./activities-add-button";
import ActivitiesDatatable from "./activities-datatable";

export default class ActivitiesView extends JetView {
	config() {
		const ui = {
			rows: [
				{
					padding: {
						right: 15
					},
					cols: [
						ActivitiesAddButton
					]
				},
				new ActivitiesDatatable(this.app, "", activities, true)
			]
		};
		return ui;
	}
}
