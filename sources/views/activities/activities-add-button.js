import {JetView} from "webix-jet";

export default class ActivitiesView extends JetView {
	config() {
		const addActivityButton = {
			view: "button",
			label: "Add activity",
			type: "icon",
			icon: "fas fa-plus-square",
			css: "custom-button",
			inputWidth: 130,
			align: "right",
			padding: {
				right: 10
			},
			click: () => {
				this.app.callEvent("activitiesDatatable:showPopup", []);
			}
		};
		return addActivityButton;
	}
}
