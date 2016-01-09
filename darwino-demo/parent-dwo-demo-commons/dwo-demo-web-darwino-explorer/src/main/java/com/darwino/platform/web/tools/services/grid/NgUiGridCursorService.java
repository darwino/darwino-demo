/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc 2014-2015.
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.     
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
