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
