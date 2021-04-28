import {JetView} from "webix-jet";

import ActivitiesDatatable from "./activities-datatable";
import CommonPopup from "../common-popup";
import activities from "../../models/activities";
import ActivitiesAddButton from "./activities-add-button";

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
	init() {
		this.popup = this.ui(new CommonPopup(this.app, "", activities));
	}
}
