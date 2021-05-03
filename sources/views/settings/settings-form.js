import {JetView} from "webix-jet";

export default class PopupFormView extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this.data = data;
	}

	config() {
        const icons = ["pen","flag","clock","phone","comment","cogs","user","plus","wrench","pause","bed","futbol","passport","walking","wine-glass-alt","utensils","car","plane"];
		const form = {
			view: "form",
			localId: "form",
			elements: [
				{
					view: "text",
					name: "Value",
					label: `${this.name} name`,
                    labelWidth: 140,
					invalidMessage: "Name cannot be empty",
				},
				{
					view: "richselect",
					name: "Icon",
					label: "Icon",
                    labelWidth: 140,
					invalidMessage: "Icon cannot be empty",
                    options: {
						body:{
							data: icons,
							template: `#value#  <span class="fas fa-#value#"></span>`
						}
					}
				},
                {
					cols: [
						{
							margin: 20,
							cols: [
								{},
								{
									view: "button",
									label: this.buttonName,
									css: "custom-button",
									align: "right",
									width: 100,
									click: () => {
										this.saveData();
									}
								},
								{
									view: "button",
									label: "Cancel",
									css: "custom-button",
									align: "right",
									width: 100,
									click: () => {
										this.hideWindow();
									}
								}
							]
						}
					]
				}
			],
			rules: {
				Value: webix.rules.isNotEmpty,
				Icon: webix.rules.isNotEmpty
			}
		};
		const popup = {
			view: "window",
			position: "center",
			head: `${this.activityName} ${this.name}`,
			modal: true,
			maxWidth: 700,
			body: form
		};

		return popup;
	}

	init() {
		this.form = this.$$("form");
        if (this.item) {
			this.form.setValues(this.item);
		}
	}

	showWindow(settings, item, name) {
        this.name = name;
		this.activityName = (settings && "Edit") || "Add";
		this.buttonName = (settings && "Save") || "Add";
		this.item = item;
		this.refresh();
		this.getRoot().show();
	}

	hideWindow() {
		const form = this.form;

		form.clear();
		form.clearValidation();

		this.getRoot().hide();
	}

	saveData() {
		const form = this.form;
		const data = this.data;

		if (form.validate()) {
			const formItem = form.getValues();
			const formItemId = formItem.id;

			if (form.isDirty()) {
				// Protection against XSS
				formItem.Value = webix.template.escape(formItem.Value);

				if (data.exists(formItemId)) {
					form.setDirty(false);
					data.updateItem(formItemId, formItem);
				}
				else {
					data.add(formItem);
				}

				webix.message({
					text: "Validation is succsessful",
					type: "success",
					expire: 1000
				});
				this.hideWindow();
			}
			else {
				webix.message({
					text: "You have not edited the data",
					type: "info",
					expire: 1000
				});
			}
		}
	}
}