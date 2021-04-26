import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import statuses from "../models/statuses";

export default class ContactsTemplateView extends JetView {
	config() {
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
							const userName = `<span class="contacts-template_name">${(obj && obj.FirstName) || "-"} ${(obj && obj.LastName) || "-"}</span>`;
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
							const userPhoto = `${(obj && obj.Photo && `<img src="${obj.Photo}" width="150">`) || "<span class=\"far fa-user\"></span>"}`;
							const userStatus = `<span class="contacts-template_status">${(obj && obj.StatusID && statuses.getItem(obj.StatusID).Value) || "-"}</span>`;

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
										label: "Delete",
										css: "btn",
										type: "icon",
										icon: "fas fa-trash-alt",
										autowidth: true
									},
									{
										view: "button",
										label: "Edit",
										css: "btn",
										type: "icon",
										icon: "fas fa-edit",
										autowidth: true
									}
								]
							},
							{}
						]
					}
				]
			};
			return contactTemplate;
		});
	}

	init() {
		this.contactsTemplate = this.$$("contactsTemplate");
	}

	urlChange() {
		const id = this.getParam("user", true);
		contacts.waitData.then(() => {
			if (!!id && contacts.exists(id)) {
				this.contactsTemplate.parse(contacts.getItem(id));
			}
		});
	}
}
