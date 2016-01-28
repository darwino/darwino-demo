/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2016.
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

package com.darwino.platform.web.tools.services.grid;

import java.io.IOException;
import java.util.Map;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.serialization.JsonWriter;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.services.HttpServiceError;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Index;
import com.darwino.jsonstore.Store;


/**
 * Handle the services expected by JqGrid.
 * 
 * @author priand
 */
public class JqGridCursorService extends GridCursorService {
	
	protected class GridCursorHandler extends BaseCursorHandler {
		public GridCursorHandler(JsonWriter jw, String transformer) throws JsonException {
			super(jw, transformer);
		}
	}
	
	public JqGridCursorService(Store store, Index index) {
		super(store, index);
	}

	@Override
	public void service(HttpServiceContext context) {
		if(context.isGet()) {
			processJq(context);
		} else {
			throw HttpServiceError.errorUnsupportedMethod(context.getMethod());
		}
	}	
	//_search=false&nd=1412201630334&rows=50&page=1&sidx=&sord=asc	
	public void processJq(final HttpServiceContext context) {
		try {
			Map<String,String> params = context.getQueryParameterMap();
			int rows = context.getQueryParameterInt("rows");
			if(rows>0) {
				params.put("limit", params.get("rows"));
			}
			int page = context.getQueryParameterInt("page");
			if(page>0) {
				params.put("offset", Integer.toString(rows*(page-1)));
			}

			Cursor c = createCursor(context,params);
			int count = c.count();
			
			String transformer = (String)context.getRequestAttribute("transformer");
			
			JsonWriter jw = context.getJsonWriter();
			jw.startObject();
			jw.outIntProperty("total",count/rows);
			jw.outIntProperty("page",page);
			jw.startProperty("rows");
			jw.startArray();
				GridCursorHandler h = new GridCursorHandler(jw,transformer);
				c.find(h);
			jw.endArray();
			jw.endProperty();
			jw.outIntProperty("records",count);
			jw.endObject();
			jw.flush();
		} catch(JsonException ex) {
			throw HttpServiceError.error500(ex);
		} catch(IOException ex) {
			throw HttpServiceError.error500(ex);
		}
	}
}
