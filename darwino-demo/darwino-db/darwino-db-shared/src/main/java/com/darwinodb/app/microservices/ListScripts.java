/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.microservices;

import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.microservices.JsonMicroService;
import com.darwino.commons.microservices.JsonMicroServiceContext;
import com.darwino.commons.util.QuickSort;



/**
 * ListScripts micro-service.
 */
public class ListScripts implements JsonMicroService {
		
	public static final String NAME = "ListScripts";
	
	@Override
	public void execute(JsonMicroServiceContext context) throws JsonException {
		JsonArray a = new JsonArray();
		
		standardScripts(a);
		
		(new QuickSort.JavaList(a)).sort();
		
		context.setResponse(a);
	}

	
	private void standardScripts(JsonArray a) {
		a.add("Hello World");
		a.add("Install Contacts Demo");
		a.add("Install Contacts Demo - script");
	}
}
