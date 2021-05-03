import {JetView} from "webix-jet";

export default class ActivitiesFiltersView extends JetView {
	config() {
		const filters = ["All", "Overdue", "Completed", "Today", "Tomorrow", "This week", "This month"];
		const activitiesFilters = {
			view: "tabbar", 
			id: "tabbar", 
			value: "All", 
			options: filters,
			on: {
				onChange: function(value){
 				console.log(value)
                }
			}
		}

		return activitiesFilters;
	}
}
