import {JetView} from "webix-jet";

import contacts from "../../models/contacts";
import statuses from "../../models/statuses";

export default class ContactsFormView extends JetView {
	config() {
		const header = {
			view: "template",
			type: "header",
			localId: "header",
			template: "#action# contact",
			css: "webix_header app_header app_header-big",
			data: {action: ""}
		};

		const firstFormColumn = {
			margin: 20,
			rows: [
				{
					view: "text",
					name: "FirstName",
					label: "First name",
					labelWidth: 150,
					invalidMessage: "First name cannot be empty"
				},
				{
					view: "text",
					name: "LastName",
					label: "Last name",
					labelWidth: 150,
					invalidMessage: "Last name cannot be empty"
				},
				{
					view: "datepicker",
					name: "StartDate",
					label: "Joining date",
					format: ("%j %F %Y"),
					labelWidth: 150
				},
				{
					view: "richselect",
					name: "StatusID",
					label: "Status",
					invalidMessage: "Status cannot be empty",
					labelWidth: 150,
					options: statuses

				},
				{
					view: "text",
					name: "Job",
					label: "Job",
					labelWidth: 150
				},
				{
					view: "text",
					name: "Company",
					label: "Company",
					labelWidth: 150
				},
				{
					view: "text",
					name: "Website",
					label: "Webiste",
					labelWidth: 150
				},
				{
					view: "text",
					name: "Address",
					label: "Adress",
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
							label: "Change photo",
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
							label: "Delete photo",
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
					label: "Cancel",
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
					invalidMessage: "Email is the necessary field"
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
					label: "Phone",
					labelWidth: 150
				},
				{
					view: "datepicker",
					name: "Birthday",
					label: "Birthday",
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
		this.form = this.$$("form");
		this.header = this.$$("header");
		this.actionButton = this.$$("actButton");
		this.cancelButton = this.$$("cancelButton");
		this.contactPhoto = this.$$("contactPhoto");
		this.action = this.getParam("action") || "Set";
		this.header.setValues({action: this.action});
		this.actionButton.setValue((this.action === "Edit" && "Save") || "Add");
		this.parser = webix.Date.dateToStr("%Y-%m-%d");
		this.contactsList = this.getParentView().contactsList;
		this.addButton = this.getParentView().addButton;
		this.addButton.disable();
	}

	urlChange() {
		const id = this.getParam("user");
		const action = this.getParam("action");
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
			if (action === "Add new") {
				this.contactsList.unselectAll();
			}
		});
	}

	saveData() {
		const form = this.form;
		const data = contacts;

		if (form.validate()) {
			const formItem = form.getValues();
			const formItemId = formItem.id;

			if (form.isDirty()) {
				// Protection against XSS
				const unKeys = ["Birthday", "StartDate", "StatusID", "id", "value", "Photo"];
				Object.keys(formItem).filter(key => unKeys.indexOf(key) === -1)
					.forEach((key) => {
						formItem[key] = webix.template.escape(formItem[key]);
					});

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
						text: "Validation is succsessful",
						type: "success",
						expire: 1000
					});
				}).then((obj) => {
					this.closeForm(obj);
				});
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

	closeForm(obj) {
		const form = this.form;

		form.clear();
		form.clearValidation();
		this.addButton.enable();
		this.contactsList.define({select: true});

		if (obj) {
			this.contactsList.select(obj.id);
		}

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
