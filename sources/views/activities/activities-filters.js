import {JetView} from "webix-jet";

export default class ActivitiesFiltersView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const filters = [
			"All", "Overdue",
			"Completed", "Today",
			"Tomorrow", "ThisWeek",
			"ThisMonth"]
			.map(el => _(el));
		const activitiesFilters = {
			view: "tabbar",
			id: "tabbar",
			value: _("All"),
			options: filters,
			on: {
				onChange: () => {
					this.datatable.filterByAll();
				}
			}
		};
		return activitiesFilters;
	}

	init() {
		this.parser = webix.Date.dateToStr("%Y-%m-%d");
		const _ = this.app.getService("locale")._;

		this.on(this.app, "ActivitiesFilters:getDatatable", (datatable) => {
			this.datatable = datatable;
			this.datatable.registerFilter(
				this.$$("tabbar"),
				{
					compare: (cellValue, filterValue, obj) => {
						switch (filterValue) {
							case _("All"):
								return true;
							case _("Overdue"):
								return String(obj.State) === String("Open") && obj.DueDate < new Date();
							case _("Completed"):
								return String(obj.State) === String("Close");
							case _("Today"):
								return this.parser(obj.DueDate) === this.parser(new Date());
							case _("Tomorrow"): {
								const tomorrowDay = new Date(+new Date() + 1000 * 60 * 60 * 24);
								return this.parser(obj.DueDate) === this.parser(tomorrowDay);
							}
							case _("ThisWeek"):
								return this.checkThisWeek(obj.DueDate);
							case _("ThisMonth"):
								return obj.DueDate.getMonth() === new Date().getMonth();
							default:
								return true;
						}
					}
				},
				{
					getValue: view => view.getValue(),
					setValue: (view, value) => {
						view.setValue(value);
					}
				}
			);
		});
	}

	checkThisWeek(date) {
		const day = new Date().getDay();
		const sunday = new Date(+new Date() + 1000 * 60 * 60 * 24 * (7 - day));
		const monday = new Date(+new Date() - 1000 * 60 * 60 * 24 * (day - 1));
		return date >= monday && date <= sunday;
	}
}
