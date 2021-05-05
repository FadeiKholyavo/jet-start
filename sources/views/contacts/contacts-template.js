import {JetView} from "webix-jet";

import activities from "../../models/activities";
import contacts from "../../models/contacts";
import files from "../../models/files";
import statuses from "../../models/statuses";
import ActivitiesAddButton from "../activities/activities-add-button";
import ActivitiesDatatable from "../activities/activities-datatable";
import FilesDatatable from "../files-datatable";

export default class ContactsTemplateView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return statuses.waitData.then(() => {
			const contactTemplate = {
				cols: [
					{
						view: "template",
						localId: "contactsTemplate",
						css: {
							"border-right": "1px solid transparent"
						},
						template(obj) {
							const statusItem = statuses.getItem(obj.StatusID);
							const statusValue = obj && obj.StatusID && statusItem && statusItem.Value;
							const icon = statusItem && statusItem.Icon;
							const userName = `<span class="contacts-template_name">
												${(obj && obj.FirstName) || "-"} ${(obj && obj.LastName) || "-"}
											</span>`;
							const userInfo = `  <ul>
                                                    <li><span class="fas fa-at"></span>${(obj && obj.Email) || "-"}</li>
                                                    <li><span class="fab fa-skype"></span>${(obj && obj.Skype) || "-"}</li>
                                                    <li><span class="fas fa-tags"></span>${(obj && obj.Job) || "-"}</li>
                                                    <li><span class="fas fa-briefcase"></span>${(obj && obj.Company) || "-"}</li>
                                                </ul>
                                                <ul>
                                                    <li><span class="far fa-calendar-alt"></span>${(obj && obj.Birthday) || "-"}</li>
                                                    <li><span class="fas fa-map-marker-alt"></span>${(obj && obj.Address) || "-"}</li>
                                                </ul>`;
							const userPhoto = `${(obj && obj.Photo && `<img src="${obj.Photo}">`) || "<span class=\"far fa-user\"></span>"}`;
							const userStatus = `<span class="contacts-template_status">${statusValue || "-"} <span class="fas fa-${icon}"></span></span>`;

							return `<div class="contacts-template">
                                        <div class="contacts-template_first-row">
                                            ${userName}
                                        </div>
                                        <div class="contacts-template_second-row">
                                            <div class="contacts-template_photo">
                                                ${userPhoto}
                                            </div>
                                            <div class="contacts-template_info">
                                                ${userInfo}
                                            </div>     
                                        </div>     
                                        <div class="contacts-template_third-row">
                                            ${userStatus} 
                                        </div>
                                    </div> 
                                    </div>`;
						}
					},
					{
						css: {
							"border-left": "1px solid transparent",
							padding: "30px 0 0 0"
						},
						rows: [
							{
								margin: 10,
								width: 300,
								cols: [
									{
										view: "button",
										label: _("Delete"),
										css: "custom-button",
										type: "icon",
										icon: "fas fa-trash-alt",
										autowidth: true,
										click: () => {
											this.deleteContact();
										}
									},
									{
										view: "button",
										label: _("Edit"),
										css: "custom-button",
										type: "icon",
										icon: "fas fa-edit",
										autowidth: true,
										click: () => {
											this.app.callEvent("Contacts:onContactEdit", []);
											this.show(`contacts-form?action=Edit&user=${this.getParam("user", true)}`);
										}
									}
								]
							},
							{}
						]
					}
				]
			};
			const ui = {
				localId: "contactsWindow",
				rows: [
					contactTemplate,
					{
						view: "tabview",
						cells: [
							{
								header: _("Activities"),
								body: {
									rows: [
										new ActivitiesDatatable(this.app, "", activities, false),
										{
											padding: {
												right: 15,
												bottom: 10
											},
											cols: [
												ActivitiesAddButton
											]
										}
									]
								}
							},
							{
								header: _("Files"),
								body: new FilesDatatable(this.app, "", files)
							}
						]
					}
				]
			};

			return ui;
		});
	}

	init() {
		this.contactsTemplate = this.$$("contactsTemplate");
		this.contactList = this.getParentView().contactsList;

		this.on(this.app, "ContactsTemplate:onAfterContactSelect", (flag) => {
			if (flag) {
				this.$$("contactsWindow").show();
			}
			else {
				this.$$("contactsWindow").hide();
			}
		});
	}

	urlChange() {
		const id = this.getParam("user", true);
		contacts.waitData.then(() => {
			if (!!id && contacts.exists(id)) {
				this.contactsTemplate.parse(contacts.getItem(id));
			}
		});
	}

	deleteContact() {
		const _ = this.app.getService("locale")._;
		webix.confirm({
			title: _("ContactDeleting"),
			text: _("ContactDelMessage")
		}).then(() => {
			const idParam = this.getParam("user", true);
			const contact = contacts.getItem(idParam);
			if (contact) {
				const contactId = contact.id;
				contacts.remove(contactId);
				activities.find(obj => String(obj.ContactID) === String(contactId))
					.forEach((obj) => {
						activities.remove(obj.id);
					});

				const contactsFirstId = contacts.getFirstId();
				if (contactsFirstId) {
					this.app.callEvent("Contacts:onAfterGetListFirstId", [contactsFirstId]);
				}
				else {
					this.show("contacts-form?action=Add new");
				}
			}
			else {
				webix.message({
					text: "There is no such contact",
					type: "error",
					expire: 1000
				});
			}
		});
	}
}
