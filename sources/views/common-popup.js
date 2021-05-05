import {JetView} from "webix-jet";

import activitiesType from "../models/activities-type";
import contacts from "../models/contacts";


export default class CommonPopupView extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this.data = data;
		this._ = this.app.getService("locale")._;
	}

	config() {
		const form = {
			view: "form",
			localId: "form",
			elements: [
				{
					view: "textarea",
					name: "Details",
					label: this._("Details"),
					height: 100
				},
				{
					view: "richselect",
					name: "TypeID",
					label: this._("Type"),
					invalidMessage: this._("TypeEmptyMessage"),
					options: {
						body: {
							data: activitiesType,
							template: "<span class=\"fas fa-#Icon#\"></span>  #Value#"
						}
					}
				},
				{
					view: "richselect",
					name: "ContactID",
					localId: "ContactID",
					label: this._("Contact"),
					invalidMessage: this._("ContactEmptyMessage"),
					options: contacts
				},
				{
					margin: 30,
					cols: [
						{
							view: "datepicker",
							name: "Date",
							label: this._("Date"),
							format: ("%j %F %Y")
						},
						{
							view: "datepicker",
							type: "time",
							name: "Time",
							label: this._("Time"),
							format: "%H:%i"
						}
					]
				},
				{
					view: "checkbox",
					name: "State",
					uncheckValue: "Open",
					checkValue: "Close",
					labelRight: this._("Complited"),
					labelWidth: 0
				},
				{
					cols: [
						{
							margin: 20,
							cols: [
								{},
								{
									view: "button",
									label: this.buttonName,
									css: "custom-button",
									align: "right",
									width: 100,
									click: () => {
										this.saveData();
									}
								},
								{
									view: "button",
									label: this._("Cancel"),
									css: "custom-button",
									align: "right",
									width: 100,
									click: () => {
										this.hideWindow();
									}
								}
							]
						}
					]
				}
			],
			rules: {
				TypeID: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty
			}
		};
		const popup = {
			view: "window",
			position: "center",
			head: `${this.activityName}`,
			modal: true,
			maxWidth: 700,
			body: form
		};

		return popup;
	}

	init() {
		const contactId = this.getParam("user", true);
		this.form = this.$$("form");
		this.contactReachSelect = this.$$("ContactID");

		if (contactId) {
			this.contactReachSelect.define({
				readonly: true,
				value: contactId
			});
		}

		if (this.item) {
			this.item.Time = this.item.DueDate;
			this.item.Date = this.item.DueDate;
			this.form.setValues(this.item);
		}
	}

	showWindow(settings, item) {
		this.activityName = (settings && "Edit") || "Add";
		this.activityName = this._(`${this.activityName}Activity`);
		this.buttonName = this._((settings && "Save") || "Add");
		this.item = item;
		this.refresh();
		this.getRoot().show();
	}

	hideWindow() {
		const form = this.form;

		form.clear();
		form.clearValidation();

		this.getRoot().hide();
	}

	saveData() {
		const form = this.form;
		const data = this.data;

		if (form.validate()) {
			const formItem = form.getValues();
			const formItemId = formItem.id;

			if (form.isDirty()) {
				// Protection against XSS
				formItem.Details = webix.template.escape(formItem.Details);

				const time = webix.i18n.dateFormatDate(formItem.Time) || new Date();
				const date = webix.i18n.dateFormatDate(formItem.Date) || new Date();
				formItem.DueDate = new Date(
					date.getFullYear(),
					date.getMonth(), date.getDate(),
					time.getHours(), time.getMinutes()
				);

				if (data.exists(formItemId)) {
					form.setDirty(false);
					data.updateItem(formItemId, formItem);
				}
				else {
					data.add(formItem);
				}

				this.app.callEvent("activitiesDatatable:setDefaultFilterState", []);

				webix.message({
					text: this._("SuccsessValidation"),
					type: "success",
					expire: 1000
				});
				this.hideWindow();
			}
			else {
				webix.message({
					text: this._("NotEditedData"),
					type: "info",
					expire: 1000
				});
			}
		}
	}
}
