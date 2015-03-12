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

package com.darwino.application.jsonstore;

import java.io.IOException;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Index;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.services.cursor.CursorService;
import com.darwino.jsonstore.sql.impl.full.CursorImpl;


/**
 * GET the content of a set of entries from an index.
 * 
 * This implementation can also return the underlying SQL query for debugging purposes, instead of the
 * actual result.
 * 
 * @author priand
 */
public class DevCursorService extends CursorService {
	
	public DevCursorService(Store store, Index index, int method) {
		super(store, index, method);
	}

	@Override
	public void process(final HttpServiceContext context, Cursor c) throws JsonException, IOException {
		if(context.getQueryParameterBoolean("_sql")) {
			processSql(context, c);
		} else if(context.getQueryParameterBoolean("_explain")) {
			processExplain(context, c);
		} else {
			super.process(context, c);
		}
	}
	
	protected void processSql(final HttpServiceContext context, Cursor c) throws JsonException, IOException {
		if(c instanceof CursorImpl) {
			CursorImpl ci = (CursorImpl)c;
			boolean count = getMethod()==METHOD_COUNT; 
			String sql = ci.generateMainSQL(count);
			context.emitText(sql);
		} else {
			throw new JsonException(null,"Cannot retrieve the SQL statement for this cursor");
		}
	}
	
	protected void processExplain(final HttpServiceContext context, Cursor c) throws JsonException, IOException {
		if(c instanceof CursorImpl) {
			CursorImpl ci = (CursorImpl)c;
			boolean count = getMethod()==METHOD_COUNT; 
			context.emitText(ci.explain(count));
		} else {
			throw new JsonException(null,"Cannot retrieve the SQL statement for this cursor");
		}
	}
}
