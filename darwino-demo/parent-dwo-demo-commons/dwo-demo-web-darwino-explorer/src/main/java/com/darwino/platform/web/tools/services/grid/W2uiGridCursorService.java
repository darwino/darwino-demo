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
import java.util.HashMap;
import java.util.Map;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.serialization.JsonWriter;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.services.HttpServiceError;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Index;
import com.darwino.jsonstore.Store;


/**
 * Handle the services expected by a W2UI grid.
 * 
 * @author priand
 */
public class W2uiGridCursorService extends GridCursorService {

	protected class GridCursorHandler extends BaseCursorHandler {
		public GridCursorHandler(JsonWriter jw, String transformer) throws JsonException {
			super(jw, transformer);
		}
	}

	public W2uiGridCursorService(Store store, Index index) {
		super(store, index);
	}

	@Override
	public void service(HttpServiceContext context) {
		if(context.isPost()) {
			processW2ui(context);
		} else {
			throw HttpServiceError.errorUnsupportedMethod(context.getMethod());
		}
	}	

	public void processW2ui(final HttpServiceContext context) {
		try {
			Map<String,String> params = new HashMap<String, String>();
			String qs = context.getContentAsString();
			String[] entries = StringUtil.splitString(qs,'&');
			for(int i=0; i<entries.length; i++) {
				String e = entries[i];
				int pos = e.indexOf('=');
				if(pos>=0) {
					params.put(e.substring(0,pos), e.substring(pos+1));
				}
			}

			Cursor c = createCursor(context,params);
			int count = c.count();
			
			String transformer = (String)context.getRequestAttribute("transformer");
			
			JsonWriter jw = context.getJsonWriter();
			jw.startObject();
			jw.outStringProperty("status","success");
			jw.outIntProperty("total",count);
			jw.startProperty("records");
			jw.startArray();
				c.find(new GridCursorHandler(jw,transformer));
			jw.endArray();
			jw.endProperty();
			jw.endObject();
			jw.flush();
		} catch(JsonException ex) {
			throw HttpServiceError.error500(ex);
		} catch(IOException ex) {
			throw HttpServiceError.error500(ex);
		}
	}
}
