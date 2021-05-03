import {JetView} from "webix-jet";

import activities from "../../models/activities";
import ActivitiesAddButton from "./activities-add-button";
import ActivitiesDatatable from "./activities-datatable";
import ActivitiesFilters from "./activities-filters";

export default class ActivitiesView extends JetView {
	config() {
		const ui = {
			rows: [
				{
					padding: {
						right: 15
					},
					cols: [
						ActivitiesFilters,
						ActivitiesAddButton
					]
				},
				new ActivitiesDatatable(this.app, "", activities, true)
			]
		};
		return ui;
	}
}
