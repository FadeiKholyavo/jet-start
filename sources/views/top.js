import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const header = {
			view: "template",
			type: "header",
			localId: "header",
			template: "#page#",
			css: "webix_header app_header",
			data: [
				{page: ""}
			],
			borderless: false
		};

		const menu = {
			view: "menu",
			localId: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: `<span class="fas #icon#"></span> <span class="item">#value#</span>`,
			data: [
				{value: "Contacts", id: "contacts", icon: "fa-users"},
				{value: "Activities", id: "activities", icon: "fa-calendar-alt"},
				{value: "Settings", id: "settings", icon: "fa-cogs"}
			]
		};

		const ui = {
			rows: [
				header,
				{
					cols: [
						{
							paddingX: 5,
							paddingY: 10,
							rows: [menu]
						},
						{
							rows: [
								{$subview: true}
							]
						}
					]}

			]

		};
		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
		this.header = this.$$("header");
	}

	urlChange(view, url) {
		this.header.data.page = (url[1] && url[1].page) || "CRM";
		this.header.refresh();
	}
}
