import {JetView} from "webix-jet";

import activitiesType from "../../models/activities-type";
import contacts from "../../models/contacts";
import CommonPopup from "../common-popup";

export default class ActivitiesView extends JetView {
	constructor(app, name, data, flag) {
		super(app, name);
		this.data = data;
		this.isActivityView = flag;
		this._ = this.app.getService("locale")._;
	}

	config() {
		const activitiesDatatatble = {
			view: "datatable",
			localId: "activitiesDatatatble",
			css: "webix_data_border webix_header_border",
			scroll: "y",
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
					header: [{text: this._("ActivityType")}, {content: "selectFilter"}],
					options: activitiesType,
					sort: "text",
					template(obj) {
						const activityTypeItem = activitiesType.getItem(obj.TypeID);
						const activityTypeValue = activityTypeItem && activityTypeItem.Value;
						const icon = activityTypeItem && activityTypeItem.Icon;
						return (activityTypeValue && `${activityTypeValue}   <span class="fas fa-${icon}"></span>`) || "Type";
					},
					width: 150
				},
				{
					id: "DueDate",
					header: [{text: this._("DueDate")}, {content: "dateRangeFilter",
						inputConfig: {format: webix.Date.dateToStr("%j %F %Y")}}],
					sort: "date",
					format: webix.Date.dateToStr("%j %F %Y"),
					width: 150
				},
				{
					id: "Details",
					header: [{text: this._("Details")}, {content: "textFilter"}],
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
		this.on(this.app, "activitiesDatatable:showPopup", () => {
			this.popup.showWindow();
		});
		this.on(this.app, "activitiesDatatable:setDefaultFilterState", () => {
			this.activitiesDatatatble.setState({filter: {CustomFilter: "All"}});
		});

		this.activitiesDatatatble = this.$$("activitiesDatatatble");
		this.popup = this.ui(new CommonPopup(this.app, "", this.data));

		this.app.callEvent("ActivitiesFilters:onAfterDatatableCreate", [this.activitiesDatatatble]);

		this.activitiesDatatatble.sync(this.data);

		if (this.isActivityView) {
			this.data.filter();

			// Add ContactID to the datatable in the activities.js
			this.addContactIdColumn();
		}
	}

	urlChange() {
		const contactId = this.getParam("user", true);
		if (contactId) {
			this.filterContactActivities(contactId);
		}
	}

	filterContactActivities(contactId) {
		this.data.waitData.then(() => {
			this.activitiesDatatatble.setState({filter: {}});
			this.data.filter(obj => String(obj.ContactID) === String(contactId));
		});
	}

	deleteItem(tablelItemId) {
		webix.confirm({
			title: this._("ActivityDeleting"),
			text: this._("ActivityDeletingMessage")
		}).then(
			() => {
				this.data.remove(tablelItemId);
			}
		);
	}

	addContactIdColumn() {
		this.activitiesDatatatble.config.columns.splice(4, 0,
			{
				id: "ContactID",
				header: [{text: this._("Contact")}, {content: "selectFilter"}],
				options: contacts,
				sort: "text",
				template(obj) {
					const contact = contacts.getItem(obj.ContactID);
					return `${(contact && contact.FirstName) || "Name"} ${(contact && contact.LastName) || "Surname"}`;
				},
				width: 150
			});
		this.activitiesDatatatble.refreshColumns();
	}
}
