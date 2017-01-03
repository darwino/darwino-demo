storeId "nsfdata"

useSecurityFields true
folderSupport true

formConverter { doc ->
	def json = doc.getJson();
	
	// In this case, we only care about whether or not it's a response document
	def parentId = json.get(com.darwino.jsonstore.Document.SYSTEM_PARENTID);
	if(parentId instanceof String && StringUtil.isNotEmpty((String)parentId)) {
		return "Response";
	} else {
		return "MainTopic";
	}
}

def commonDoc = {
	field "from", flags:AUTHORS
	field "remote_user", flags:NAMES
	
	// TODO add "abrfrom", etc. converters(?)
	// They're not stored as Names in Notes
	field "altfrom"
	field "abbreviatefrom"
	field "abrfrom"
	field "body", type:RICHTEXT
	field "categories", flags:MULTIPLE
	
	field "form"
	
	// From the Social Edition forums
	field "role", flags:MULTIPLE
	field "tags", flags:MULTIPLE
	
	// Also from the N/D 6/7 and SE forums, but odd
	field "fields", flags:MULTIPLE
	field "fieldsrequired", flags:MULTIPLE
	field "feedbacksubmitted", flags:MULTIPLE
	field "release", flags:MULTIPLE
	field "release_1", flags:MULTIPLE
	field "release_2", flags:MULTIPLE
	field "release2", flags:MULTIPLE
	field "version", flags:MULTIPLE
	field "platform", flags:MULTIPLE
	field "platform_1", flags:MULTIPLE
	field "platform_2", flags:MULTIPLE
	field "category", flags:MULTIPLE
	field "text", flags:MULTIPLE
	field "urlpick", flags:MULTIPLE
}

form("MainTopic", commonDoc)
form("Response", commonDoc)
form("ResponseToResponse", commonDoc)

form("CategoryProfile") {
	storeId "config"
	
	field "category", flags:MULTIPLE
}
form("Profile") {
	storeId "config"
}
form("Configuration") {
	storeId "config"
	
	field "dbtype"
	field "attachmentconfig"
	field "authorprofileconfig"
	field "trackingmailconfig"
	field "interestprofileconfig"
}

// N/D 6/7 forum specific
form("Main Topic", commonDoc)
form("Lookup") {
	storeId "config"
	
	field "category", flags:MULTIPLE
	field "release", flags:MULTIPLE
	field "platform", flags:MULTIPLE
}
form("return", commonDoc)