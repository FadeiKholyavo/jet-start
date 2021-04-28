import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import statuses from "../models/statuses";
import activities from "../models/activities";
import ActivitiesDatatable from "./activities-datatable";
import ActivitiesAddButton from "./activities-add-button";
import FilesDatatable from "./files-datatable";
import files from "../models/files";

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
							const userPhoto = `${(obj && obj.Photo && `<img src="${obj.Photo}">`) || "<span class=\"far fa-user\"></span>"}`;
							const userStatus = `<span class="contacts-template_status">${(obj && obj.StatusID && statuses.getItem(obj.StatusID)  && statuses.getItem(obj.StatusID).Value) || "-"}</span>`;

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
							"padding": "30px 0 0 0"
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
										autowidth: true,
										click: ()=>{
											this.deleteContact();
										}
									},
									{
										view: "button",
										label: "Edit",
										css: "btn",
										type: "icon",
										icon: "fas fa-edit",
										autowidth: true,
										click:()=>{
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
				rows:[
					contactTemplate,
					{
						view: "tabview",
						cells: [
							{
								header: "Activities",
								body: {
									rows:[
										new ActivitiesDatatable(this.app, "", activities, false),
										{
											padding: {
												right: 15
											},
											cols: [
												ActivitiesAddButton
											]
										},
										{height:10}
									]
								}
							},
							{
								header: "Files",
								body: new FilesDatatable(this.app, "", files)
							}
						]
					}
				]
			}

			return ui;

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
	deleteContact(){
		webix.confirm({
			title: "User deleting",
			text: "Do you really want to delete this contact"
		}).then(()=>{
					const contactId = contacts.getItem(this.getParam("user", true)).id;
					contacts.remove(contactId);
					activities.find((obj)=>{
						return obj.ContactID == contactId;
					}).forEach((obj)=>{
						activities.remove(obj.id);
					})
					if(contacts.getFirstId()){
						this.getParentView().contactsList.select(contacts.getFirstId());
					}else{
						this.show("contacts-form?action=Add new");
					}
			})
	}
}
