/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands.domino;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.darwino.commons.Platform;
import com.darwino.commons.httpclnt.HttpClient;
import com.darwino.commons.httpclnt.HttpConnection;
import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.json.JsonUtil;
import com.darwino.commons.json.jsonpath.JsonPath;
import com.darwino.commons.json.jsonpath.JsonPathFactory;
import com.darwino.commons.util.QuickSort;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.sql.DBSchema;
import com.darwino.jsonstore.sql.LocalSqlJsonDBServer;
import com.darwino.jsonstore.sql.SqlJsonDriver;
import com.darwino.platform.DarwinoApplication;
import com.darwino.rdbc.SqlConnection;
import com.darwino.script.DSRuntimeException;
import com.darwinodb.app.scripts.commands.BaseDatabaseCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

@Command(name="domino-import-forms",description="Create a series of database views based on the Domino forms definition",mixinStandardHelpOptions = true)
public  class ImportFormsCommand extends BaseDatabaseCommand {

	public static final String FORM_TABLE_SUFFIX = "_F_";

	@Option(names = {"-c", "--connection"}, description = "Name of the HTTP connection to use, or default")
	public String connection;

	@Option(names = {"--nsf"}, description = "Name of the Domino NSF database")
	public String nsf;
	
	@Option(names = {"--dryrun"}, description = "Do not create the view but display the SQL")
	public boolean dryrun;

	public ImportFormsCommand() {
	}

	@Override
	public Integer call() throws Exception {
		checkDatabase();

		if(StringUtil.isEmpty(nsf)) {
			throw new DSRuntimeException(null,"The Domino NSF is empty");
		}
		
		doImport();
		
		println("Forms from NSF {0} successfully created in database {1}", nsf, database);

		return 0;
	}
	
	private void doImport() throws JsonException {
		LocalSqlJsonDBServer srv = (LocalSqlJsonDBServer)DarwinoApplication.get().getLocalJsonDBServer(); 
//		LocalSqlContext ctx = srv.getSqlContext();
//		SqlJsonDriver driver = srv.getJsonDriver();
		
		JsonArray schema = readSchema();
		//Platform.log("Read Schema={0}",schema);
		
		deleteViews(srv);
		createViews(srv,schema);
	}
	
	private JsonArray readSchema() throws JsonException {
		HttpConnection conn = Platform.getManagedBean(HttpConnection.BEAN_TYPE, connection);
		HttpClient httpClient = conn.createHttpClient();						
		Map<String,Object> params = Collections.singletonMap("dbpath", nsf);
		JsonArray a = (JsonArray)httpClient.getAsJson(new String[]{"jsonschema"},params);
		return a;
	}
	
	private void deleteViews(LocalSqlJsonDBServer srv) throws JsonException {
		List<String> views = srv.getSqlContext().listViews(database+FORM_TABLE_SUFFIX);
		Platform.log("Delete views="+views.toString());
		srv.getSqlContext().deleteViews(views);
	}

	private void createViews(LocalSqlJsonDBServer srv, JsonArray schema) throws JsonException {		
		SqlConnection c = srv.createConnection();
		try {
			for(int i=0; i<schema.size(); i++) {
				createView(srv, c, schema.getObject(i));
			}
		} finally {
			c.close();
		}
	}
	private void createView(LocalSqlJsonDBServer srv, SqlConnection c, JsonObject view) throws JsonException {
		SqlJsonDriver driver = srv.getJsonDriver();
		String form = view.getString("title");
		String viewName = sqlViewName(form);
		
		StringBuilder b = new StringBuilder();
		b.append("CREATE VIEW ");
		b.append(viewName);
		b.append(" AS SELECT ");

		final JsonObject properties = view.getObject("properties");
		List<String> fields = new ArrayList<String>();
		fields.addAll(properties.keySet());
		new QuickSort.JavaList(fields) {
	        @Override
			public int compare(Object o1, Object o2) {
	            int i1 = properties.getObject((String)o1).getInt("dwo:fieldindex");
	            int i2 = properties.getObject((String)o2).getInt("dwo:fieldindex");
	            return i1-i2;
	        }
		}.sort();
		b.append("\n  ");
		b.append(DBSchema.FDOC_DOCID);
		b.append(",\n  ");
		b.append(DBSchema.FDOC_INSTID);
		b.append(",\n  ");
		b.append(DBSchema.FDOC_STOREID);
		b.append(",\n  ");
		b.append(DBSchema.FDOC_UNID);
		
		for(String fieldName: fields) {
			JsonObject field = properties.getObject(fieldName);
			b.append(",\n  ");
			String colName = sqlColumnName(fieldName);
			JsonPath jp = JsonPathFactory.get("$."+colName.toLowerCase());
			b.append(driver.extractJsonValue(DBSchema.FDOC_JSON, jp, jsonType(field)));
			b.append(" AS ");
			b.append(colName);
		}
		b.append("\nFROM ");
		b.append((database+"_DOC").toUpperCase());
		b.append("\nWHERE ");
		JsonPath jp = JsonPathFactory.get("$.form");
		b.append(driver.extractJsonValue(DBSchema.FDOC_JSON, jp, JsonUtil.TYPE_STRING));
		b.append("=");
		b.append("'");
		b.append(form);
		b.append("'");

		String viewSql = b.toString();
		Platform.log("Create View: {0}\n{1}",viewName,viewSql);
		
		if(dryrun) {
			println("\n{0}",viewSql);	
		} else {
			c.executeUpdate(viewSql);
		}
	}
	
	private int jsonType(JsonObject field) {
		// TODO: add more types here...
		return JsonUtil.TYPE_STRING;
	}
	
	private String sqlViewName(String form) {
		String viewName = (database+FORM_TABLE_SUFFIX+form).toLowerCase();
		return viewName;
	}

	private String sqlColumnName(String property) {
		return property.toLowerCase();
	}
	
//	public void _generate(JSqlBuilder b, ASTColumnPath node) throws JsonException {
//		String jsonField = StringUtil.isNotEmpty(node.table) ? node.table+"."+DBSchema.FDOC_JSON : DBSchema.FDOC_JSON;
//
//		// TOD: extract JSON values with :json as a type
//		
//		if(StringUtil.equals(node.path, "$")) {
//			String jfield = getDriver().convertJsonToText(jsonField);
//			b.append(jfield);
//		} else {
//			String type = node.type;
//			int t = JsonUtil.TYPE_STRING;
//			if(StringUtil.isNotEmpty(type)) {
//				if(type.equals("string")) {
//					t = JsonUtil.TYPE_STRING;
//				} else if(type.equals("json") || type.equals("object")) {
//					t = JsonUtil.TYPE_OBJECT;
//				} else if(type.equals("array")) {
//					t = JsonUtil.TYPE_ARRAY;
//				} else if(type.equals("number")) {
//					t = JsonUtil.TYPE_NUMBER;
//				} else if(type.equals("int")) {
//					t = JsonUtil.TYPE_NUMBER;
//				} else if(type.equals("long")) {
//					t = JsonUtil.TYPE_NUMBER;
//				} else if(type.equals("boolean")) {
//					t = JsonUtil.TYPE_BOOLEAN;
//				} else if(type.equals("date")) {
//					t = JsonUtil.TYPE_NUMBER;
//				} else {
//					throw new JsqlException(null,"Invalid JSON type {0}",type);
//				}
//			}
//			try {
//				JsonPath jp = JsonPathFactory.get(node.path);
//				String s = getDriver().extractJsonValue(jsonField, jp, t);
//				b.append(s);
//			} catch(JsonException ex) {
//				throw new JsqlException(ex,"Invalid JSON path {0}",node.path);
//			}
//		}
//	}
	
	protected boolean isMaterialized(String formName) {
		return false;
	}
}
