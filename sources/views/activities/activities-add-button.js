import {JetView} from "webix-jet";

export default class ActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const addActivityButton = {
			view: "button",
			label: _("AddActivity"),
			type: "icon",
			icon: "fas fa-plus-square",
			css: "custom-button",
			inputWidth: 250,
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
