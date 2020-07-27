/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.microservices;

import java.io.InputStream;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.microservices.JsonMicroService;
import com.darwino.commons.microservices.JsonMicroServiceContext;
import com.darwino.commons.util.PathUtil;
import com.darwino.commons.util.io.StreamUtil;



/**
 * LoadScript micro-service.
 */
public class LoadScript implements JsonMicroService {
		
	public static final String NAME = "LoadScript";
	
	@Override
	public void execute(JsonMicroServiceContext context) throws JsonException {
		JsonObject req = (JsonObject)context.getRequest();
		String name = req.getString("name"); 
		
		try {
			InputStream is = getClass().getClassLoader().getResourceAsStream(PathUtil.concat("scripts",name+".ds"));
			try {
				String s = StreamUtil.readString(is, "utf-8");
				context.setResponse(JsonObject.of("script",s,"name",name));
			} finally {
				StreamUtil.close(is);
			}
		} catch(Exception e) {
			Platform.log(e);
			context.setResponse(JsonObject.of("error","File not found","name",name));
		}
	}
}
