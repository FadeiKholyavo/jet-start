import {JetView} from "webix-jet";

import PopupForm from "./settings-form";

export default class SettingsDatatableView extends JetView {
	constructor(app, name, data, buttonValue) {
		super(app, name);
		this.data = data;
		this.buttonValue = buttonValue;
		this._ = this.app.getService("locale")._;
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
					header: this._("Value"),
					sort: "string",
					fillspace: true
				},
				{
					id: "Icon",
					sort: "string",
					header: {text:this._("Icon"), css: "activities_columns-center"},
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
			label: this._(`Add${this.buttonValue}`),
			type: "icon",
			icon: "fas fa-plus-square",
			css: "custom-button",
			inputWidth: 280,
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
			title: this._("ItemDeleting"),
			text: this._("DeleteItemMessage")
		}).then(
			() => {
				this.data.remove(tablelItemId);
			}
		);
	}
}
