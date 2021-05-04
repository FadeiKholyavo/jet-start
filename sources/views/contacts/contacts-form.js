import {JetView} from "webix-jet";

import contacts from "../../models/contacts";
import statuses from "../../models/statuses";

export default class ContactsFormView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const header = {
			view: "template",
			type: "header",
			localId: "header",
			template: "#action#",
			css: "webix_header app_header app_header-big",
			data: {action: ""}
		};

		const firstFormColumn = {
			margin: 20,
			rows: [
				{
					view: "text",
					name: "FirstName",
					label: _("FirstName"),
					labelWidth: 150,
					invalidMessage: _("FNameEmptyMessage")
				},
				{
					view: "text",
					name: "LastName",
					label: _("LastName"),
					labelWidth: 150,
					invalidMessage: _("LNameEmptyMessage")
				},
				{
					view: "datepicker",
					name: "StartDate",
					label: _("JoiningDate"),
					format: ("%j %F %Y"),
					labelWidth: 150
				},
				{
					view: "richselect",
					name: "StatusID",
					label: _("Status"),
					labelWidth: 150,
					options: {
						body: {
							data: statuses,
							template: "#Value# <span class=\"fas fa-#Icon#\"></span>"
						}
					}

				},
				{
					view: "text",
					name: "Job",
					label: _("Job"),
					labelWidth: 150
				},
				{
					view: "text",
					name: "Company",
					label: _("Company"),
					labelWidth: 150
				},
				{
					view: "text",
					name: "Website",
					label: _("Website"),
					labelWidth: 150
				},
				{
					view: "text",
					name: "Address",
					label: _("Address"),
					labelWidth: 150
				}
			]
		};

		const photoField = {
			margin: 50,
			cols: [
				{
					view: "template",
					localId: "contactPhoto",
					name: "Photo",
					borderless: true,
					height: 260,
					template: () => {
						const contactId = this.getParam("user");
						const contact = contacts.getItem(contactId);
						const userPhoto = `${(contact && contact.Photo && `<img src="${contact.Photo}">`) || "<span class=\"far fa-user\"></span>"}`;
						return `<div class="contacts-template_photo contacts-template_photo-big">
                                    ${userPhoto}
                                </div>`;
					}
				},
				{
					margin: 10,
					rows: [
						{},
						{
							view: "uploader",
							label: _("ChangePhoto"),
							css: "custom-button",
							accept: "imgae/jpeg, imgae/png, imgae/jpg, imgae/JPG",
							width: 140,
							autosend: false,
							on: {
								onBeforeFileAdd: (upload) => {
									this.changePhoto(upload);
								}
							}
						},
						{
							view: "button",
							label: _("DeletePhoto"),
							css: "custom-button",
							width: 140,
							click: () => {
								this.deletePhoto();
							}
						}
					]
				}
			]
		};

		const bottomButttons = {
			padding: {
				top: 220
			},
			margin: 30,
			borderless: true,
			cols: [
				{},
				{
					view: "button",
					localId: "actButton",
					label: "",
					css: "custom-button",
					align: "right",
					width: 100,
					click: () => {
						this.saveData();
					}
				},
				{
					view: "button",
					label: _("Cancel"),
					localId: "cancelButton",
					css: "custom-button",
					align: "right",
					width: 100,
					click: () => {
						this.closeForm();
					}
				}
			]
		};

		const secondFormColumn = {
			margin: 20,
			rows: [
				{
					view: "text",
					name: "Email",
					label: "Email",
					labelWidth: 150,
					invalidMessage: _("EmailEmptyMessage")
				},
				{
					view: "text",
					name: "Skype",
					label: "Skype",
					labelWidth: 150
				},
				{
					view: "text",
					name: "Phone",
					label: _("Phone"),
					labelWidth: 150
				},
				{
					view: "datepicker",
					name: "Birthday",
					label: _("Birthday"),
					format: ("%j %F %Y"),
					labelWidth: 150
				},
				photoField,
				bottomButttons
			]
		};

		const form = {
			view: "form",
			localId: "form",
			css: {
				"border-top": "1px solid transparent"
			},
			elements: [
				{
					borderless: true,
					margin: 100,
					paddingX: 50,
					cols: [
						firstFormColumn,
						secondFormColumn
					]
				},
				{}
			],
			rules: {
				Email: webix.rules.isEmail,
				FirstName: webix.rules.isNotEmpty,
				LastName: webix.rules.isNotEmpty
			}
		};

		const ui = {
			rows: [
				header,
				form
			]
		};

		return ui;
	}

	init() {
		const _ = this.app.getService("locale")._;
		this.form = this.$$("form");
		this.header = this.$$("header");
		this.actionButton = this.$$("actButton");
		this.cancelButton = this.$$("cancelButton");
		this.contactPhoto = this.$$("contactPhoto");
		this.action = this.getParam("action") || "Set";
		this.header.setValues({action: _((this.action === "Edit" && `${this.action}Contact`) || (`${this.action}New`))});
		this.actionButton.setValue(_((this.action === "Edit" && "Save") || "Add"));
		this.parser = webix.Date.dateToStr("%Y-%m-%d");
	}

	urlChange() {
		const id = this.getParam("user");
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			if (!!id && contacts.exists(id)) {
				this.form.setValues(contacts.getItem(id));
			}
			if (!contacts.getFirstId()) {
				this.cancelButton.hide();
			}
		});
	}

	saveData() {
		const form = this.form;
		const data = contacts;
		const _ = this.app.getService("locale")._;

		if (form.validate()) {
			let formItem = form.getValues();
			const formItemId = formItem.id;

			if (form.isDirty()) {
				// Protection against XSS
				const unKeys = ["Birthday", "StartDate", "StatusID", "id", "value", "Photo"];
				formItem = Object.entries(formItem).reduce((acc, [key, value]) => {
					acc[key] = unKeys.includes(key) ? value : webix.template.escape(value);
					return acc;
				}, {});

				formItem.Birthday = this.parser(formItem.Birthday || new Date());
				formItem.StartDate = this.parser(formItem.StartDate || new Date());
				contacts.waitSave(() => {
					if (data.exists(formItemId)) {
						form.setDirty(false);
						data.updateItem(formItemId, formItem);
					}
					else {
						data.add(formItem);
					}

					webix.message({
						text: _("SuccsessValidation"),
						type: "success",
						expire: 1000
					});
				}).then((obj) => {
					this.closeForm(obj);
				});
			}
			else {
				webix.message({
					text: _("NotEditedData"),
					type: "info",
					expire: 1000
				});
			}
		}
	}

	closeForm(obj) {
		const form = this.form;

		form.clear();
		form.clearValidation();

		this.app.callEvent("Contacts:onAfterContactAdd", [obj]);

		this.show("contacts-template");
	}

	changePhoto(upload) {
		const reader = new FileReader();
		reader.readAsDataURL(upload.file);
		reader.onload = () => {
			const photo = reader.result;
			this.form.setValues({Photo: photo}, true);
			this.contactPhoto.define({
				template: `<div class="contacts-template_photo contacts-template_photo-big">
                                    <img src="${photo}">
                                </div>`
			});
			this.contactPhoto.refresh();
		};
		return false;
	}

	deletePhoto() {
		this.form.setValues({Photo: ""}, true);
		this.contactPhoto.define({
			template: `<div class="contacts-template_photo contacts-template_photo-big">
                            <span class="far fa-user"></span>
                        </div>`
		});
		this.contactPhoto.refresh();
	}
}
