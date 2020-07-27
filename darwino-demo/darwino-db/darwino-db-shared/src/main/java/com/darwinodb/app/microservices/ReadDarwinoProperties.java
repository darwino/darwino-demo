/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.microservices;

import java.io.File;
import java.io.IOException;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.microservices.JsonMicroService;
import com.darwino.commons.microservices.JsonMicroServiceContext;
import com.darwino.commons.util.io.StreamUtil;
import com.darwinodb.app.platform.WebPropertiesExtension;



/**
 * Read darwino.properties contents.
 */
public class ReadDarwinoProperties implements JsonMicroService {
		
	public static final String NAME = "ReadDarwinoProperties";
	
	@Override
	public void execute(JsonMicroServiceContext context) throws JsonException {
		try {
			File f = WebPropertiesExtension.getFile();
			String content = StreamUtil.readString(f);
			JsonObject result = JsonObject.of("location", f.getCanonicalPath(), "content",content);
			context.setResponse(result);
		} catch(IOException ex) {
			throw new JsonException(ex,"Error while reading darwino.properties");
		}
	}
}
