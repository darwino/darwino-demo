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
import com.darwino.commons.security.acl.User;
import com.darwino.commons.util.QuickSort;
import com.darwino.jsonstore.meta._Database;
import com.darwino.jsonstore.meta._Store;
import com.darwino.platform.DarwinoContext;
import com.darwinodb.app.AppDatabaseDef;
import com.darwinodb.app.DarwinoDBEnvironment;



/**
 * TreeView micro-service.
 */
public class TreeView implements JsonMicroService {
		
	public static final String NAME = "TreeView";

	static class SvcContext { 
		User user;
		boolean isAdmin;
	}
	
	@Override
	public void execute(JsonMicroServiceContext context) throws JsonException {
		SvcContext ctx = new SvcContext();
		ctx.user = DarwinoContext.get().getUser();
		ctx.isAdmin = ctx.user.hasRole("admin");

		JsonArray root = new JsonArray();
		root.addObject(databases(ctx));
		root.addObject(administration(ctx));
//		root.addObject(domino());
		root.addObject(help());
		
		context.setResponse(root);
	}
	
	private JsonObject databases(SvcContext ctx) throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "databases");
		o.putString("label", "Databases");

		List<_Database> dbs = DarwinoDBEnvironment.get().getUserDatabases();	
		new QuickSort.JavaList(dbs) {
			@Override
			public int compare(Object o1, Object o2) {
				return compareIds(((_Database)o1).getId(), ((_Database)o2).getId());
			}
			
		}.sort();
		
		JsonArray nodes = new JsonArray();
		for(int i=0; i<dbs.size(); i++) {
			_Database db = dbs.get(i);
			if(acceptDatabase(ctx,db)) {
				nodes.add(database(ctx,db));
			}
		}
		o.putArray("children", nodes);
		
		return o;
	}
	private boolean acceptDatabase(SvcContext ctx, _Database db) {
		// System database is only for the administrators
		// Note that we can use the ACL as well!
		if(db.getId().equals(AppDatabaseDef.DATABASE_NAME) && !ctx.isAdmin) {
			return false;
		}
		return true;
	}

	private JsonObject database(SvcContext ctx, _Database db) throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "database");
		o.putString("id", db.getId());
		o.putString("label", db.getLabel());
		
		o.putArray("children", stores(ctx,db));

		return o;
	}
	
	private JsonArray stores(SvcContext ctx, _Database db) throws JsonException {
		_Store[] stores = db.getStores().toArray(new _Store[db.getStores().size()]);
		new QuickSort.ObjectArray(stores) {
			@Override
			public int compare(Object o1, Object o2) {
				return compareIds(((_Store)o1).getId(), ((_Store)o2).getId());
			}
			
		}.sort();

		JsonArray nodes = new JsonArray();
		for(int i=0; i<stores.length; i++) {
			if(acceptStore(ctx,db,stores[i])) {
				nodes.add(store(db,stores[i]));
			}
		}
		
		return nodes;
	}
	private boolean acceptStore(SvcContext ctx, _Database db, _Store store) {
		if(db.getId().equals(AppDatabaseDef.DATABASE_NAME)) {
			String n = store.getId();
			// These stores are experimental for now...
			if(    AppDatabaseDef.STORE_SQL_NAME.equals(n) 
				|| AppDatabaseDef.STORE_JSQL_NAME.equals(n)
				|| AppDatabaseDef.STORE_REPLICATIONS_NAME.equals(n)
				|| AppDatabaseDef.STORE_TASKS_NAME.equals(n)
				|| AppDatabaseDef.STORE_USERS_NAME.equals(n)
				|| AppDatabaseDef.STORE_COMMANDS_NAME.equals(n)
				|| AppDatabaseDef.STORE_SCRIPTS_NAME.equals(n)) {
				return false;
				
			}
		}
		return true;
	}

	private JsonObject store(_Database db, _Store store) throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "store");
		o.putString("id", db.getId()+':'+store.getId());
		o.putString("label", store.getLabel());

		return o;
	}
	
	private JsonObject administration(SvcContext ctx) throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "administration");
		o.putString("label", "Administration");
		
		JsonArray children = new JsonArray();
		children.addObject(commands());
		children.addObject(scripts());
		children.addObject(sql());
//		children.addObject(jsql());
//		children.addObject(tasks());
//		children.addObject(users());
//		children.addObject(rest());
//		children.addObject(graphql());
		children.addObject(connections());
		children.addObject(beans());
		children.addObject(properties());
		o.putArray("children", children);
		return o;
	}
	private JsonObject commands() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "commands");
		o.putString("label", "Commands");
		return o;
	}
	private JsonObject scripts() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "scripts");
		o.putString("label", "Scripts");
		return o;
	}
	private JsonObject sql() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "sql");
		o.putString("label", "Sql");
		return o;
	}
	private JsonObject jsql() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "jsql");
		o.putString("label", "JSql");
		return o;
	}
	private JsonObject rest() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "rest");
		o.putString("label", "REST Services");
		return o;
	}
	private JsonObject graphql() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "graphql");
		o.putString("label", "GraphQL");
		return o;
	}
	private JsonObject tasks() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "tasks");
		o.putString("label", "Tasks");
		return o;
	}
	private JsonObject users() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "users");
		o.putString("label", "Users");
		return o;
	}
	private JsonObject connections() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "connections");
		o.putString("label", "Connections");
		return o;
	}
	private JsonObject beans() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "beans");
		o.putString("label", "Darwino Beans");
		return o;
	}
	private JsonObject properties() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "properties");
		o.putString("label", "Darwino Properties");
		return o;
	}
	

	private JsonObject domino() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "domino");
		o.putString("label", "Domino");
		
		JsonArray children = new JsonArray();
		children.addObject(dominoReplication());
		o.putArray("children", children);
		return o;
	}
	private JsonObject dominoReplication() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "domino:replication");
		o.putString("label", "Replication");
		return o;
	}

	private JsonObject help() throws JsonException {
		JsonObject o = new JsonObject();
		o.putString("_type", "help");
		o.putString("label", "Getting Started");
		return o;
	}
	
	//
	// Utilities
	//
	
	private static int compareIds(String i1, String i2) {
		boolean s1 = i1.startsWith("_");
		boolean s2 = i2.startsWith("_");
		if(s1==s2) {
			return i1.compareTo(i2);
		}
		return s1 ? 1 : -1;
	}
}
