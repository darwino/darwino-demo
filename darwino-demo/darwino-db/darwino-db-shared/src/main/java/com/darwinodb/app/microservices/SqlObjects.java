/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.microservices;

import java.util.List;

import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.microservices.JsonMicroService;
import com.darwino.commons.microservices.JsonMicroServiceContext;
import com.darwino.commons.util.QuickSort;
import com.darwino.jsonstore.sql.LocalSqlContext;
import com.darwino.jsonstore.sql.LocalSqlJsonDBServer;
import com.darwino.platform.DarwinoApplication;



/**
 * TreeView micro-service.
 */
public class SqlObjects implements JsonMicroService {
		
	public static final String NAME = "SqlObjects";
	
	@Override
	public void execute(JsonMicroServiceContext context) throws JsonException {
		LocalSqlJsonDBServer srv = (LocalSqlJsonDBServer)DarwinoApplication.get().getLocalJsonDBServer();

		JsonArray root = new JsonArray();
		root.addObject(views(srv));
		root.addObject(databases(srv));
		
		context.setResponse(root);
	}
	
	private JsonObject databases(LocalSqlJsonDBServer srv) throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "tables");
		o.putString("label", "Tables");
		
		LocalSqlContext ctx = srv.getSqlContext();
		List<String> tables = ctx.listTables(null);

		new QuickSort.JavaList(tables).sort();
		
		JsonArray nodes = new JsonArray();
		for(int i=0; i<tables.size(); i++) {
			nodes.add(database(tables.get(i)));
		}
		o.putArray("children", nodes);
		
		return o;
	}
	private JsonObject database(String db) throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "database");
		o.putString("id", db);
		return o;
	}
	
	private JsonObject views(LocalSqlJsonDBServer srv) throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "views");
		o.putString("label", "Views");
		
		LocalSqlContext ctx = srv.getSqlContext();
		List<String> views = ctx.listViews(null);

		new QuickSort.JavaList(views).sort();
		
		JsonArray nodes = new JsonArray();
		for(int i=0; i<views.size(); i++) {
			nodes.add(view(views.get(i)));
		}
		o.putArray("children", nodes);
		
		return o;
	}
	private JsonObject view(String db) throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "database");
		o.putString("id", db);
		return o;
	}
}