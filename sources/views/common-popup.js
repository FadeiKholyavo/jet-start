import {JetView} from "webix-jet";

import activitiesType from "../models/activities-type";
import contacts from "../models/contacts";


export default class CommonPopupView extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this.data = data;
	}

	config() {
		const form = {
			view: "form",
			localId: "form",
			elements: [
				{
					view: "textarea",
					name: "Details",
					label: "Deatails",
					height: 100
				},
				{
					view: "richselect",
					name: "TypeID",
					label: "Type",
					invalidMessage: "Type cannot be empty",
					options: activitiesType
				},
				{
					view: "richselect",
					name: "ContactID",
					localId: "ContactID",
					label: "Contact",
					invalidMessage: "Contact cannot be empty",
					options: contacts
				},
				{
					margin: 30,
					cols: [
						{
							view: "datepicker",
							name: "Date",
							label: "Date",
							format: ("%j %F %Y")
						},
						{
							view: "datepicker",
							type: "time",
							name: "Time",
							label: "Time",
							format: "%H:%i"
						}
					]
				},
				{
					view: "checkbox",
					name: "State",
					uncheckValue: "Open",
					checkValue: "Close",
					labelRight: "Complited",
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
									css: "btn",
									align: "right",
									width: 100,
									click: () => {
										this.saveData();
									}
								},
								{
									view: "button",
									label: "Cancel",
									css: "btn",
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
			head: `${this.activityName} activity`,
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

		if(contactId){
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
		this.buttonName = (settings && "Save") || "Add";
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

				const time = webix.i18n.dateFormatDate(formItem.Time);
				const date = webix.i18n.dateFormatDate(formItem.Date);
				if (!!time && !!date) {
					formItem.DueDate = new Date(
						date.getFullYear(),
						date.getMonth(), date.getDate(),
						time.getHours(), time.getMinutes()
					);
				}
				else {
					formItem.DueDate = new Date();
				}

				if (data.exists(formItemId)) {
					form.setDirty(false);
					data.updateItem(formItemId, formItem);
				}
				else {
					data.add(formItem);
				}

				webix.message({
					text: "Validation is succsessful",
					type: "success",
					expire: 1000
				});
				this.hideWindow();
			}
			else {
				webix.message({
					text: "You have not edited the data",
					type: "info",
					expire: 1000
				});
			}
		}
	}
}
