/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

package com.contacts.app.microservices;

import java.util.Date;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.microservices.JsonMicroService;
import com.darwino.commons.microservices.JsonMicroServiceContext;
import com.darwino.commons.util.DateFormatter;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Session;
import com.darwino.platform.DarwinoContext;



/**
 * Basic Hello World micro-service.
 */
public class HelloWorld implements JsonMicroService {
	
	public static final String NAME = "HelloWorld";
	
	@Override
	public void execute(JsonMicroServiceContext context) throws JsonException {
		Session session = DarwinoContext.get().getSession();
		JsonObject req = (JsonObject)context.getRequest();
		String greetings = req.getString("greetings"); 
		JsonObject result = JsonObject.of("message",StringUtil.format("Hello, {0}. {1}. It is {2} here, on the server!",
					session.getUser().getCn(),
					greetings,
					DateFormatter.getFormat("DEFAULT_TIME").format(new Date())));
		context.setResponse(result);
	}
}
