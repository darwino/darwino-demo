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
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonJavaFactory;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.json.JsonUtil;
import com.darwino.commons.json.query.Extraction;
import com.darwino.commons.json.query.QueryContext;
import com.darwino.commons.json.serialization.JsonWriter;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Index;
import com.darwino.jsonstore.QueryParams;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.callback.CursorEntry;
import com.darwino.jsonstore.callback.CursorHandler;
import com.darwino.jsonstore.query.CursorRecordQueryContext;
import com.darwino.jsonstore.query.SqlExtractionParser;
import com.darwino.jsonstore.services.AbstractJsonDBService;


/**
 * Handle the services expected by a UI grid.
 * 
 * We might inherit from the standard CursorService if we want more functionalities, but
 * we have enough for now.
 * 
 * @author priand
 */
public abstract class GridCursorService extends AbstractJsonDBService {
	
	protected abstract class BaseCursorHandler implements CursorHandler {
		JsonWriter jw;
		Extraction t;
		int arrayCount;
		BaseCursorHandler(JsonWriter jw, String transformer) throws JsonException {
			this.jw = jw;
			this.t = SqlExtractionParser.instance.parse(transformer);
		}
		public int getArrayCount() {
			return arrayCount;
		}
		@Override
		public boolean handle(CursorEntry entry) throws JsonException {
			try {
				arrayCount++;
				JsonObject o = new JsonObject();
				o.put("pos",entry.getPosition());
				o.put("id",entry.getDocId());
				o.put("unid",entry.getUnid());
				o.put("parent",entry.getParentUnid());
				o.put("cdate",JsonUtil.dateToString(entry.getCreationDate(),TimeZone.getDefault()));
				o.put("cuser",entry.getCreationUser());
				o.put("mdate",JsonUtil.dateToString(entry.getLastModificationDate(),TimeZone.getDefault()));
				o.put("muser",entry.getLastModificationUser());
				if(t!=null) {
					QueryContext qc = new CursorRecordQueryContext(entry.getCursor(),null,entry);
					Object r = t.evaluate(qc, o);
					o.put("value",r);
				} else {
					if(index!=null) {
						o.put("key",asString(entry.getKey()));
					}
					o.put("value",asString(entry.getJson()));
				}
				jw.outArrayObject(o);
				return true;
			} catch (IOException e) {
				throw new JsonException(e);
			}
		}
	}
	
	private Store store;
	private Index index;
	
	public GridCursorService(Store store, Index index) {
		this.store = store;
		this.index  = index;
	}
	
	public Store getStore() {
		return store;
	}

	public Index getIndex() {
		return index;
	}

	protected String asString(Object o) throws JsonException {
		if(o==null) {
			return null;
		}
		if(o instanceof Map<?,?> || o instanceof List<?>) {
			return JsonJavaFactory.instance.toJson(o);
		}
		return o.toString();
	}
	
	protected Cursor createCursor(final HttpServiceContext context, Map<String,String> params) throws JsonException {
		Cursor c;
		if(getIndex()!=null) {
			c = getIndex().openCursor();
		} else {
			c = getStore().openCursor();
		}

		String ftsearch = params.get("ftsearch");
		if(StringUtil.isEmpty(ftsearch)) {
			// we use the query param as a FT search entry
			ftsearch = params.get("search[0][value]");
		}
		if(StringUtil.isNotEmpty(ftsearch)) {
			c.ftSearch(ftsearch);
		}
		
		String unid = params.get("unid");
		if(StringUtil.isNotEmpty(unid)) {
			c.unid(unid);
		}
		
		String parentId = params.get("parentid");
		if(StringUtil.isNotEmpty(parentId)) {
			c.parentUnid(parentId);
		}
		
		String key = params.get("key");
		if(StringUtil.isNotEmpty(key)) {
			c.key(keyFromString(key));
		}
		
		String partialKey = params.get("partialkey");
		if(StringUtil.isNotEmpty(partialKey)) {
			c.partialKey(keyFromString(partialKey));
		}
		
		String tags = params.get("tags");
		if(StringUtil.isNotEmpty(tags)) {
			c.tags(StringUtil.splitString(tags,','));
		}
		
		String startKey = params.get("startkey");
		if(StringUtil.isNotEmpty(startKey)) {
			c.startKey(keyFromString(startKey),context.getQueryParameterBoolean("excludestart"));
		}
		
		String endKey = params.get("endkey");
		if(StringUtil.isNotEmpty(endKey)) {
			c.endKey(keyFromString(endKey),context.getQueryParameterBoolean("excludeend"));
		}

		int skip = parseInt(params.get("offset"));
		int limit = parseInt(params.get("limit"));
		if(skip>0 || limit>0) {
			c.range(skip,limit);
		}
		
//		if(context.getQueryParameterBoolean("descending")) {
//			c.descending();
//		}
		
		int options = QueryParams.CURSOR_OPTIONS.asInt(context.getQueryParameterInt("options")); 
		if(options>0) {
			c.options(options);
		}
		
		String query = context.getQueryParameterString("query");
		if(StringUtil.isNotEmpty(query)) {
			c.query(query);
		}
		
		String extract = context.getQueryParameterString("extract");
		if(StringUtil.isNotEmpty(extract)) {
			c.extract(extract);
		}
		
		String transformer = context.getQueryParameterString("transformer");
		if(StringUtil.isNotEmpty(transformer)) {
			context.getRequestAttributes().put("transformer",transformer);
		}
		
		return c;
	}
	protected int parseInt(String s) {
		if(StringUtil.isNotEmpty(s)) {
			return Integer.parseInt(s);
		}
		return 0;
	}
	
	public static Object keyFromString(String key) throws JsonException {
		// This can be a json string or a simple one
		return JsonJavaFactory.instance.fromJson(key);
	}
}
