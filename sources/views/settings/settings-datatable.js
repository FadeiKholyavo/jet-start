import {JetView} from "webix-jet";

import PopupForm from "./settings-form";

export default class SettingsDatatableView extends JetView {
	constructor(app, name, data, buttonValue) {
		super(app, name);
		this.data = data;
		this.buttonValue = buttonValue;
	}

	config() {
		const datatable = {
			view: "datatable",
			localId: "datatable",
			css: "webix_data_border webix_header_border",
			select: true,
			scroll: "y",
			columns: [
				{
					id: "Value",
					header: "Value",
					sort: "string",
					fillspace: true
				},
				{
					id: "Icon",
					sort: "string",
					header: {text:"Icon", css: "activities_columns-center"},
					width: 100,
					css: "activities_columns-center",
					template: obj => {
						return `<span class="fas fa-${obj.Icon}">`
					}
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
					this.popup.showWindow(id, item, this.buttonValue);
				}
			}
		};

		const addButton= {
			view: "button",
			label: `Add ${this.buttonValue}`,
			type: "icon",
			icon: "fas fa-plus-square",
			css: "custom-button",
			inputWidth: 170,
			align: "right",
			click: () => {
				this.popup.showWindow(null, null, this.buttonValue);
			}
		};

		const ui = {
			rows: [
				datatable,
				{
					padding: {
						right: 15
					},
					rows:[
						addButton
					]
				},
				{height: 11}
			]
		};

		return ui;
	}

	init() {
		this.datatable = this.$$("datatable");
		this.datatable.sync(this.data);
		this.popup = this.ui(new PopupForm(this.app, "", this.data));
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
}
