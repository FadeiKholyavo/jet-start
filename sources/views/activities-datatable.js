import {JetView} from "webix-jet";

import activitiesType from "../models/activities-type";
import CommonPopup from "./common-popup";
import contacts from "../models/contacts";

export default class ActivitiesView extends JetView {
    constructor(app, name, data, flag) {
		super(app, name);
		this.data = data;
        this.isActivityView = flag;
	}

	config() {
		const activitiesDatatatble = {
			view: "datatable",
			localId: "activitiesDatatatble",
			css: "webix_data_border webix_header_border",
            scroll: "y",
			select: true,
			columns: [
				{
					id: "State",
					header: "",
					checkValue: "Close",
					uncheckValue: "Open",
					css: "activities_columns-center",
					template: "{common.checkbox()}",
					sort: "string",
					width: 40},
				{
					id: "TypeID",
					header: [{text: "Activity type"}, {content: "selectFilter"}],
					options: activitiesType,
					sort: "string",
					template(obj) {
						return (obj && obj.TypeID && activitiesType.getItem(obj.TypeID).Value) || "Status";
					},
					width: 150
				},
				{
					id: "DueDate",
					header: [{text: "Due date"}, {content: "dateRangeFilter",
						inputConfig: {format: webix.Date.dateToStr("%j %F %Y")}}],
					sort: "date",
					format: webix.Date.dateToStr("%j %F %Y"),
					width: 150
				},
				{
					id: "Details",
					header: [{text: "Details"}, {content: "textFilter"}],
					sort: "string",
					fillspace: true
                },
				{
					id: "Edit",
					header: "",
					css: "activities_columns-center",
					template: "{common.editIcon()}",
					width: 40
                },
				{
					id: "Delete",
					header: "",
					css: "activities_columns-center",
					template: "{common.trashIcon()}",
					width: 40
				}
			],
			onClick: {
				"wxi-trash": (e, id) => {
					this.deleteItem(id);
					return false;
				},
				"wxi-pencil": (e, id) => {
					const item = this.data.getItem(id);
					this.popup.showWindow(id, item);
				}
			}
		};

		return activitiesDatatatble;
	}

	init() {

        this.on(this.app, "onItemClick", (data)=>{
            this.popup.showWindow(data);
        });
        
		this.activitiesDatatatble = this.$$("activitiesDatatatble");
		this.popup = this.ui(new CommonPopup(this.app, "", this.data));
        this.activitiesDatatatble.sync(this.data); 

        this.datatableColumns = this.activitiesDatatatble.config.columns;     

        if(this.isActivityView){

            this.data.filter()
            this.activitiesDatatatble.sync(this.data);

            //Add ContactID to the datatable in the activities.js
            this.addContactIdColumn();
        }
	}
    urlChange(){
        const contactId = this.getParam("user", true);
        if(contactId){
            this.syncContactActivities(contactId);
        }
    }
    syncContactActivities(contactId){

        this.data.filter(obj => obj.ContactID == contactId);
        this.activitiesDatatatble.sync(this.data);
        
    }
	deleteItem(tablelItemId) {
		webix.confirm({
			title: "Activity deleting",
			text: "Do you really want to delete this activity"
		}).then(
			() => {
				this.data.remove(tablelItemId);
			}
		);
	}
    addContactIdColumn(){
        this.datatableColumns.splice(4, 0, 
            {
                id: "ContactID",
                header: [{text: "Contact"}, {content: "selectFilter"}],
                options: contacts,
                sort: "text",
                template(obj) {
                    const contact = contacts.getItem(obj.ContactID);
                    return `${(contact && contact.FirstName) || "Name"} ${(contact && contact.LastName) || "Surname"}`;
                },
                width: 150
            }
        );
        this.activitiesDatatatble.refreshColumns();
    }
}