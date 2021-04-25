const parse = webix.Date.dateToStr("%Y-%m-%d %H:%i");
export default new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(obj) {
			obj.DueDate = new Date(obj.DueDate);
		},
		$save(obj) {
			obj.DueDate = parse(obj.DueDate);
		}
	}
});
