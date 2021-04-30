const parse = webix.Date.dateToStr("%Y-%m-%d %H:%i");
export default new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init(obj) {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
		},
		$save(obj) {
			obj.Birthday = parse(new Date(obj.Birthday));
			obj.StartDate = parse(new Date(obj.StartDate));
		}
	}
});
