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
					header: "Details",
					sort: "string",
                    width: 150
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

        const addFileButton = {
			view: "button",
			label: "Upload file",
			type: "icon",
			icon: "fas fa-upload",
			css: "btn",
			inputWidth: 140,
			align: "center",
			click: () => {
			}
		};

        const ui = {
            rows:[
                filesDatatable,
                addFileButton,
                {height:10}
            ]
        }

		return ui;
	}

	init() {
		this.filesDatatable = this.$$("filesDatatable");

	}
    deleteItem(tablelItemId) {
		webix.confirm({
			title: "File deleting",
			text: "Do you really want to delete this file"
		}).then(
			() => {
				this.data.remove(tablelItemId);
			}
		);
	}
}