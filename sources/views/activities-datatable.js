import {JetView} from "webix-jet";

import activitiesType from "../models/activities-type";
import CommonPopup from "./common-popup";

export default class ActivitiesView extends JetView {
    constructor(app, name, data, flag) {
		super(app, name);
		this.data = data;
        this.isActivityView = flag;
	}

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
					fillspace: true
                },
				{
					id: "Edit",
					header: "",
					css: "activities_columns-center",
					template: "{common.editIcon()}",
					width: 40
                },
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
					const item = this.data.getItem(id);
					this.popup.showWindow(id, item);
				}
			}
		};

		return activitiesDatatatble;
	}

	init() {
		this.activitiesDatatatble = this.$$("activitiesDatatatble");
		this.popup = this.ui(new CommonPopup(this.app, "", this.data));
        this.activitiesDatatatble.sync(this.data); 
	}

	deleteItem(tablelItemId) {
		webix.confirm({
			title: "Country deleting",
			text: "Do you really want to delete this activity"
		}).then(
			() => {
				this.data.remove(tablelItemId);
			}
		);
	}
}