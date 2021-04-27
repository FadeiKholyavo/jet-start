import {JetView} from "webix-jet";

import CommonPopup from "./common-popup";
import activities from "../models/activities";

export default class ActivitiesView extends JetView {
	config() {
		const addActivityButton = {
			view: "button",
			label: "Add activity",
			type: "icon",
			icon: "fas fa-plus-square",
			css: "btn",
			inputWidth: 130,
			align: "right",
			padding: {
				right: 10
			},
			click: () => {
				this.getParentView().popup.showWindow(null);
			}
		};
		return addActivityButton;
	}
}