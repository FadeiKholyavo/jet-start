import {JetView} from "webix-jet";

export default class FilesDatatableView extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this.data = data;
	}

	config() {
		const filesDatatable = {
			view: "datatable",
			localId: "filesDatatable",
			css: "webix_data_border webix_header_border",
			select: true,
			scroll: "y",
			columns: [
				{
					id: "Name",
					header: "Name",
					checkValue: "Close",
					sort: "string",
					fillspace: true
				},
				{
					id: "ChangeDate",
					header: "Change date",
					sort: "date",
					format: webix.Date.dateToStr("%j %F %Y"),
					width: 150
				},
				{
					id: "Size",
					header: "Size",
					sort: "int",
					width: 150,
					template: "#SizeText#"
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
				}
			}
		};

		const filesUploader = {
			view: "uploader",
			localId: "filesUploader",
			label: "Upload file",
			type: "icon",
			icon: "fas fa-upload",
			css: "btn",
			inputWidth: 140,
			align: "center",
			autosend: false,
			on: {
				onAfterFileAdd: (obj) => {
					this.saveFile(obj);
				}
			}
		};

		const ui = {
			rows: [
				filesDatatable,
				filesUploader,
				{height: 11}
			]
		};

		return ui;
	}

	init() {
		this.filesDatatable = this.$$("filesDatatable");
		this.filesDatatable.sync(this.data);
	}

	urlChange() {
		const contactId = this.getParam("user", true);
		if (contactId) {
			this.syncContactFiles(contactId);
		}
	}

	deleteItem(tablelItemId) {
		webix.confirm({
			title: "File deleting",
			text: "Do you really want to delete this file?"
		}).then(
			() => {
				this.data.remove(tablelItemId);
			}
		);
	}

	saveFile(obj) {
		const contactId = this.getParam("user", true);

		const file = {
			ContactID: contactId,
			Name: obj.file.name,
			Size: obj.file.size,
			SizeText: obj.sizetext,
			ChangeDate: obj.file.lastModifiedDate
		};
		this.data.add(file);
	}

	syncContactFiles(contactId) {
		this.data.filter(obj => String(obj.ContactID) === contactId);
		this.filesDatatable.sync(this.data);
	}
}
