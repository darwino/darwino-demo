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
import com.darwinodb.app.platform.WebBeanExtension;



/**
 * Read darwino-beans.xml contents.
 */
public class ReadDarwinoBean implements JsonMicroService {
		
	public static final String NAME = "ReadDarwinoBeans";
	
	@Override
	public void execute(JsonMicroServiceContext context) throws JsonException {
		try {
			File f = WebBeanExtension.getFile();
			String content = StreamUtil.readString(f);
			JsonObject result = JsonObject.of("location", f.getCanonicalPath(), "content",content);
			context.setResponse(result);
		} catch(IOException ex) {
			throw new JsonException(ex,"Error while reading darwino-beans.xml");
		}
	}
}
