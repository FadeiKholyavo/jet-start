export default new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init(obj) {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
		},
		$save(obj){
			obj.Birthday = obj.Birthday + " 00:00";
			obj.StartDate = obj.StartDate + " 00:00";
		}
	}
});
