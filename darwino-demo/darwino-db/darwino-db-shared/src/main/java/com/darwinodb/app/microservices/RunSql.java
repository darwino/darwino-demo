/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.microservices;

import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.microservices.JsonMicroService;
import com.darwino.commons.microservices.JsonMicroServiceContext;
import com.darwino.commons.util.ArrayUtil;
import com.darwino.jsonstore.sql.LocalSqlJsonDBServer;
import com.darwino.platform.DarwinoApplication;
import com.darwino.rdbc.SqlConnection;
import com.darwino.rdbc.SqlResultSet;



/**
 * Run SQL query.
 */
public class RunSql implements JsonMicroService {
		
	public static final String NAME = "RunSql";
	
	@Override
	public void execute(JsonMicroServiceContext context) throws JsonException {
		JsonObject req = (JsonObject)context.getRequest();
		String sql = req.getString("sql");
		boolean meta = req.getBoolean("metadata");
		int maxRows = req.getInt("maxrows",1000);
		JsonArray _params = req.getArray("parameters");
		Object[] params = _params!=null ? _params.toArray() : ArrayUtil.EMPTY_ARRAY;
		
		LocalSqlJsonDBServer srv = (LocalSqlJsonDBServer)DarwinoApplication.get().getLocalJsonDBServer();
		
		SqlConnection c = srv.createConnection();
		try {
			SqlResultSet rs = c.executeQuery(sql, params);
			try {
				JsonObject res = new JsonObject();
				int colCount = rs.getColumnCount();
				
				// Column definitions
				JsonArray cols = null;
				if(meta) {
					cols = new JsonArray();
					for(int i=1; i<=colCount; i++) {
						JsonObject col = new JsonObject();
						col.putString("name",rs.getColumnName(i));
						col.putInt("size",rs.getColumnName(i).length());
						cols.add(col);
					}
					res.put("columns",cols);
				}
				
				// Data
				JsonArray rows = new JsonArray();
				for(int r=0; r<maxRows && rs.next(); r++) {
					JsonObject row = new JsonObject();
					for(int i=1; i<=colCount; i++) {
						Object v = rs.getAsJson(i);
						if(v instanceof String) {
							String s = (String)v;
							if(s.length()>100) {
								v = s = s.substring(0,100)+"...";
							}
						}
						if(cols!=null && v!=null) {
							int sz = v.toString().length();
							if(sz>cols.getObject(i-1).getInt("size")) {
								cols.getObject(i-1).putInt("size", sz);
							}								
						}
						row.put(rs.getColumnName(i),v);
					}
					rows.add(row);
				}
				res.put("rows",rows);
				
				context.setResponse(res);
			} finally {
				rs.close();
			}
		} finally {
			c.close();
		}
	}

}
