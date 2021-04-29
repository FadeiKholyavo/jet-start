import {JetView} from "webix-jet";

import contacts from "../../models/contacts";

export default class ContactsView extends JetView {
	config() {
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
			label: "Add contact",
			type: "icon",
			icon: "fas fa-plus-square",
			css: "custom-button",
			click: () => {
				this.contactsList.define({select: false});
				this.show("contacts-form?action=Add new");
			}
		};

		const ui = {
			cols: [
				{
					rows: [
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
		this.contactsList.sync(contacts);
		this.addButton = this.$$("addButton");
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
				this.show("contacts-form?action=Add new");
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
}

