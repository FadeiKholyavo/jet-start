import {JetView} from "webix-jet";

import contacts from "../../models/contacts";

export default class ContactsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const contactsList = {
			view: "list",
			localId: "contactsList",
			type: {
				height: "auto"
			},
			width: 300,
			select: true,
			template(obj) {
				return `<div class="contacts-list">
                            <span class="contacts-list_photo">
                                ${(obj && obj.Photo && `<img src="${obj.Photo}">`) || "<span class=\"far fa-user\"></span>"}
                            </span>
                            <div class="contacts-list_info">
                                <span class="contacts-list_name">
                                    ${(obj && obj.FirstName) || "-"} ${(obj && obj.LastName) || "-"}
                                </span>
                                <span class="contacts-list_company">
                                    ${(obj && obj.Company) || "-"}
                                </span>
                            </div>
                        </div>`;
			},
			on: {
				onAfterSelect: (id) => {
					this.setParam("user", id, true);
				}
			}
		};
		const addButton = {
			view: "button",
			localId: "addButton",
			label: _("AddContact"),
			type: "icon",
			icon: "fas fa-plus-square",
			css: "custom-button",
			click: () => {
				this.contactsList.define({disabled: true});
				this.contactsFilter.disable();
				this.addButton.disable();
				this.show("contacts-form?action=Add").then(() => {
					contacts.waitData.then(() => {
						this.contactsList.unselectAll();
					});
				});
			}
		};

		const contactsFilter = {
			view: "text",
			localId: "contactsFilter",
			placeholder: _("Placeholder"),
			on: {
				onTimedKeyPress() {
					const value = webix.template.escape(this.getValue().toLowerCase());
					this.$scope.filterContacts(value);
				}
			}
		};

		const ui = {
			cols: [
				{
					rows: [
						contactsFilter,
						contactsList,
						addButton,
						{height: 10}
					]
				},
				{$subview: true}
			]
		};
		return ui;
	}

	init() {
		this.contactsList = this.$$("contactsList");
		this.contactsFilter = this.$$("contactsFilter");
		this.contactsList.sync(contacts);
		this.addButton = this.$$("addButton");

		this.on(this.app, "Contacts:onAfterContactAdd", (obj) => {
			this.contactsList.define({
				disabled: false,
				select: true
			});
			this.contactsFilter.enable();
			this.addButton.enable();
			if (obj) {
				this.contactsList.select(obj.id);
			}
		});
		this.on(this.app, "Contacts:onAfterGetListFirstId", (contactsFirstId) => {
			this.contactsList.select(contactsFirstId);
		});
		this.on(this.app, "Contacts:onContactEdit", () => {
			this.contactsList.define({select: false});
			this.addButton.disable();
			this.contactsFilter.disable();
		});
	}

	ready() {
		contacts.waitData.then(() => {
			if (contacts.getFirstId()) {
				this.show("contacts-template");
				if (!this.addButton.isEnabled()) {
					this.addButton.enable();
				}
			}
			else {
				this.show("contacts-form?action=Add");
				this.addButton.disable();
			}
		});
	}

	urlChange() {
		const id = this.getParam("user");
		contacts.waitData.then(() => {
			if (!!id && contacts.exists(id)) {
				this.contactsList.select(id);
			}
			else {
				this.contactsList.select(contacts.getFirstId());
			}
		});
	}

	filterContacts(value) {
		const contactsList = this.contactsList;
		const unKeys = ["LastName", "FirstName", "Email", "Company", "Job", "Skype"];
		contactsList.filter((obj) => {
			let info = Object.entries(obj).reduce((acc, [key, val]) => {
				acc += unKeys.includes(key) ? ` ${val}` : "";
				return acc;
			}, String());
			return info.toLowerCase().indexOf(value) !== -1;
		});
		const firstId = contactsList.getFirstId();
		const selectedId = contactsList.getSelectedId();
		if (!selectedId && firstId) {
			contactsList.select(firstId);
			this.app.callEvent("ContactsTemplate:onAfterContactSelect", [true]);
		}
		if (!firstId) {
			this.app.callEvent("ContactsTemplate:onAfterContactSelect", [false]);
		}
	}
}

