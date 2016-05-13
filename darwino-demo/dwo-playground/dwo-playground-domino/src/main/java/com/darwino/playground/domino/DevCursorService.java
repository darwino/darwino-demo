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

package com.darwino.playground.domino;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Index;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.services.cursor.CursorContentFilter;
import com.darwino.jsonstore.services.cursor.CursorService;
import com.darwino.jsonstore.sql.impl.full.CursorImpl;
import com.darwino.jsonstore.sql.impl.full._SqlCursor;
import com.darwino.sql.drivers.DBDriver;
import com.darwino.sql.drivers.db2.DB2Driver;
import com.darwino.sql.drivers.postgresql.PostgreSQLDriver;
import com.darwino.sql.drivers.sqlite.SQLiteDriver;
import com.darwino.sql.drivers.sqlserver.SqlServerDriver;


/**
 * GET the content of a set of entries from an index.
 * 
 * This implementation can also return the underlying SQL query for debugging purposes, instead of the
 * actual result.
 * 
 * @author priand
 */
public class DevCursorService extends CursorService {
	
	public DevCursorService(Database database, Store store, Index index, int method, CursorContentFilter filter) {
		super(database, store, index, method, filter);
	}

	@Override
	public void process(final HttpServiceContext context, Cursor c) throws JsonException, IOException {
		if(context.getQueryParameterBoolean("_sql")) { //$NON-NLS-1$
			String db = context.getQueryParameterString("_db");
			processSql(context, c, db);
		} else if(context.getQueryParameterBoolean("_explain")) { //$NON-NLS-1$
			processExplain(context, c);
		} else {
			super.process(context, c);
		}
	}
	
	protected void processSql(final HttpServiceContext context, Cursor c, String db) throws JsonException, IOException {
		if(c instanceof CursorImpl) {
			CursorImpl ci = (CursorImpl)c;
			DBDriver driver;
			if(StringUtil.equalsIgnoreCase(db,"db2")) {
				Map<String, Object> p = new HashMap<String, Object>();
			    p.put("fullTextSearch",true);
			    p.put("nativeJson",true);
				driver = new DB2Driver(DB2Driver.CURRENT_VERSION,p);
			} else if(StringUtil.equalsIgnoreCase(db,"postgresql")) {
				Map<String, Object> p = new HashMap<String, Object>();
				driver = new PostgreSQLDriver(PostgreSQLDriver.CURRENT_VERSION,p);
			} else if(StringUtil.equalsIgnoreCase(db,"sqlserver")) {
				Map<String, Object> p = new HashMap<String, Object>();
				driver = new SqlServerDriver(SqlServerDriver.CURRENT_VERSION,p);
			} else if(StringUtil.equalsIgnoreCase(db,"sqlite")) {
				Map<String, Object> p = new HashMap<String, Object>();
				driver = new SQLiteDriver(SQLiteDriver.CURRENT_VERSION,p);
			} else {
				driver = ci.getSession().getSqlContext().getDbDriver();
			}
			boolean countOnly = getMethod()==METHOD_COUNT; 
			String sql = _SqlCursor.sqlCursorStoreSql(driver, ci, countOnly);
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
