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
 * Handle the services expected by a Angular UIGrid.
 * 
 * @author priand
 */
public class NgUiGridCursorService extends GridCursorService {
	
	protected class GridCursorHandler extends BaseCursorHandler {
		public GridCursorHandler(JsonWriter jw, String transformer) throws JsonException {
			super(jw, transformer);
		}
	}
	
	public NgUiGridCursorService(Store store, Index index) {
		super(store, index);
	}

	@Override
	public void service(HttpServiceContext context) {
		if(context.isGet()) {
			processNgUiGrid(context);
		} else {
			throw HttpServiceError.errorUnsupportedMethod(context.getMethod());
		}
	}	

	public void processNgUiGrid(final HttpServiceContext context) {
		try {
			Map<String,String> params = context.getQueryParameterMap();
			Cursor c = createCursor(context,params);
			
			String transformer = (String)context.getRequestAttribute("transformer");
			
			JsonWriter jw = context.getJsonWriter();
			jw.startArray();
				c.find(new GridCursorHandler(jw,transformer));
			jw.endArray();
			jw.flush();
		} catch(JsonException ex) {
			throw HttpServiceError.error500(ex);
		} catch(IOException ex) {
			throw HttpServiceError.error500(ex);
		}
	}
}
