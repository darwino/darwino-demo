/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package com.contacts.app.microservices;

import static com.darwino.commons.i18n.AppMessages._t;

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
		JsonObject result = JsonObject.of("message",StringUtil.format(
					_t("hello.world","Hello, {0}. {1}. It is {2} here, on the server!"),
					session.getUser().getCn(),
					greetings,
					DateFormatter.getFormat("DEFAULT_TIME").format(new Date())));
		context.setResponse(result);
	}
}
