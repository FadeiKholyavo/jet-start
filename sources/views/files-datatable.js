import {JetView} from "webix-jet";

export default class FilesDatatableView extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this.data = data;
		this._ = this.app.getService("locale")._;
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
					header: this._("Name"),
					checkValue: "Close",
					sort: "string",
					fillspace: true
				},
				{
					id: "ChangeDate",
					header: this._("ChangeDate"),
					sort: "date",
					format: webix.Date.dateToStr("%j %F %Y"),
					width: 150
				},
				{
					id: "Size",
					header: this._("Size"),
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
			label: this._("UploadFile"),
			type: "icon",
			icon: "fas fa-upload",
			css: "custom-button",
			inputWidth: 170,
			align: "center",
			autosend: false,
			on: {
				onAfterFileAdd: (obj) => {
					this.saveFile(obj);
				}
			}
		};

		const ui = {
			padding: {
				bottom: 11
			},
			rows: [
				filesDatatable,
				filesUploader
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
			this.filterContactFiles(contactId);
		}
	}

	deleteItem(tablelItemId) {
		webix.confirm({
			title: this._("FileDeleting"),
			text: this._("FileDelMessage")
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

	filterContactFiles(contactId) {
		this.data.waitData.then(() => {
			this.data.filter(obj => String(obj.ContactID) === String(contactId));
		});
	}
}
