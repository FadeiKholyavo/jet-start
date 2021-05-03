import {JetView} from "webix-jet";
import activities from "../../models/activities";

export default class ActivitiesFiltersView extends JetView {
	config() {
		const filters = ["All", "Overdue", "Completed", "Today", "Tomorrow", "This week", "This month"];
		const activitiesFilters = {
			view: "tabbar", 
			id: "tabbar", 
			value: "All", 
			options: filters,
			on: {
				onChange: value => {
 				    this.filterActivities(value);
                }
			}
		}
		return activitiesFilters;
	}
    filterActivities(value){
        activities.waitData.then(() => {
            switch(value){
                case "All": 
                    activities.filter();
                    break;
                case "Overdue":
                    activities.filter(obj => String(obj.State) === String("Open"));
                    break;
                case "Completed":
                    activities.filter(obj => String(obj.State) === String("Close"));
                    break;
                case "Today":
                    activities.filter(obj => this.parser(obj.DueDate) === this.parser(new Date()));
                    break;
                case "Tomorrow":
                    activities.filter(obj => this.parser(obj.DueDate) === this.parser(new Date(+new Date() + 1000*60*60*24)));
                    break;
                case "This week":
                    activities.filter(obj => this.checkThisWeek(obj.DueDate));
                    break;
                case "This month":
                    activities.filter(obj => obj.DueDate.getMonth() === new Date().getMonth());
                    break;    
            }
		});
    }
    init(){
        this.parser = webix.Date.dateToStr("%Y-%m-%d");
    }
    checkThisWeek(date){
        const day = new Date().getDay();
        const sunday = new Date(+new Date() + 1000*60*60*24*(7 - day));
        const monday = new Date(+new Date() - 1000*60*60*24*(day - 1));
        console.log(sunday, monday)
        return date >= monday && date <=sunday;
    }
}
