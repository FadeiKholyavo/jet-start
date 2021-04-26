import {JetView} from "webix-jet";

import statuses from "../models/statuses";
import contacts from "../models/contacts";

export default class ContactsFormView extends JetView {
	config() {
        const header = {
			view: "template",
			type: "header",
			localId: "header",
			template: "#action# contact",
			css: "webix_header app_header app_header-big", 
            data: {action:""}       
		};

        const firstFormColumn = {   
            margin: 20,  
            rows:[
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
        }
        
        const photoField = {
            margin: 50,
            cols:[
                {
                    view: "template",
                    borderless: true,
                    height: 260,
                    template: () =>{
                        const userPhoto = `${(contacts && contacts.Photo && `<img src="${contacts.Photo}" width="150">`) || `<span class="far fa-user"></span>`}`;
                        return `<div class="contacts-template_photo contacts-template_photo-big">
                                    ${userPhoto}
                                </div>`
                    }
                },
                {
                    margin: 10,
                    rows:[
                        {},
                        {
                            view: "button",
                            label: "Change photo",
                            css: "btn",
                            width: 140
                        },
                        {
                            view: "button",
                            label: "Delete photo",
                            css: "btn",
                            width: 140
                        }
                    ]
                }
            ]
        }
        
        const bottomButttons = {
            padding:{
                top: 220,
            },
            margin: 30,
            borderless: true,
            cols: [
                {},
                {
                    view: "button",
                    localId: "actButton",
                    label: "",
                    css: "btn",
                    align: "right",
                    width: 100
                },
                {
                    view: "button",
                    label: "Cancel",
                    css: "btn",
                    align: "right",
                    width: 100,
                    click:()=>{
                        this.show("contacts-template")
                    }
                }
            ]                                       
        }

        const secondFormColumn = {
            margin: 20,  
            rows:[
                {
                    view: "text",
                    name: "Email",
                    label: "Email",
                    labelWidth: 150,
                    invalidMessage: "Email is the necessary field",
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
        }
            
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
                    cols:[
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
            rows:[
                header,
                form
            ]
        }

		return ui	
	}
    init(){
        this.form = this.$$("form");
        this.header = this.$$("header");
        this.actionButton = this.$$("actButton")
        this.action = this.getParam("action") || "Set";
        this.header.setValues({action: this.action});
        this.actionButton.setValue((this.action == "Edit" && "Save") || "Add");
    }
    urlChange() {
        const id = this.getParam("user");
        webix.promise.all([
            contacts.waitData,
            statuses.waitData
        ]).then(()=>{
			if (!!id && contacts.exists(id)) {
				this.form.setValues(contacts.getItem(id));
			}
        })
	}
}