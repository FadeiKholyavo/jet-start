import {JetView} from "webix-jet";

import activities from "../models/activities";
import activitiesType from "../models/activities-type";
import contacts from "../models/contacts";
import statuses from "../models/statuses";
import CommonPopup from "./common-popup";

export default class ActivitiesView extends JetView {
	config() {
		const activitiesDatatatble = {
			view: "datatable",
			localId: "activitiesDatatatble",
			css: "webix_data_border webix_header_border",
			select: true,
			columns: [
				{
					id: "State",
					header: "",
					checkValue: "Close",
					uncheckValue: "Open",
					css: "activities_columns-center",
					template: "{common.checkbox()}",
					sort: "string",
					width: 40},
				{
					id: "TypeID",
					header: [{text: "Activity type"}, {content: "selectFilter"}],
					options: activitiesType,
					sort: "string",
					template(obj) {
						return (obj && obj.TypeID && activitiesType.getItem(obj.TypeID).Value) || "Status";
					},
					width: 150
				},
				{
					id: "DueDate",
					header: [{text: "Due date"}, {content: "dateRangeFilter",
						inputConfig: {format: webix.Date.dateToStr("%j %F %Y")}}],
					sort: "date",
					format: webix.Date.dateToStr("%j %F %Y"),
					width: 150
				},
				{
					id: "Details",
					header: [{text: "Details"}, {content: "textFilter"}],
					sort: "string",
					fillspace: true},
				{
					id: "ContactID",
					header: [{text: "Contact"}, {content: "selectFilter"}],
					options: contacts,
					sort: "text",
					template(obj) {
						const contact = contacts.getItem(obj.ContactID);
						return `${(contact && contact.FirstName) || "Name"} ${(contact && contact.LastName) || "Surname"}`;
					},
					width: 150
				},
				{
					id: "Edit",
					header: "",
					css: "activities_columns-center",
					template: "{common.editIcon()}",
					width: 40},
				{
					id: "Delete",
					header: "",
					css: "activities_columns-center",
					template: "{common.trashIcon()}",
					width: 40
				}
			],
			onClick: {
				"wxi-trash": (e, id) => {
					this.deleteItem(id);
					return false;
				},
				"wxi-pencil": (e, id) => {
					const item = activities.getItem(id);
                    this.popup.showWindow(id, item);
				}
			}
		};

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
                this.popup.showWindow(null);
			}
		};

		const ui = {
			rows: [
				{
					padding: {
						right: 15
					},
					cols: [
						addActivityButton
					]
				},
				activitiesDatatatble
			]
		};
		return ui;
	}

	init() {
		this.activitiesDatatatble = this.$$("activitiesDatatatble");
        this.popup = this.ui(new CommonPopup(this.app, "", activities));
		this.activitiesDatatatble.sync(activities);   
	}

	deleteItem(tablelItemId) {
		webix.confirm({
			title: "Country deleting",
			text: "Do you really want to delete this activity"
		}).then(
			() => {
				activities.remove(tablelItemId);
			}
		);
	}
}
