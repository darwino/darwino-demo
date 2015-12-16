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

package com.darwino.demo.dominodisc.app;

import java.io.PrintStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.sql.impl.full.DBGenerator;
import com.darwino.jsonstore.sql.impl.full.JdbcDatabaseCustomizer;
import com.darwino.platform.DarwinoManifest;
import com.darwino.sql.ddl.DDLGenerator;
import com.darwino.sql.ddl.DDLOptions;
import com.darwino.sql.ddl.MetaDatabase;
import com.darwino.sql.ddl.MetaSqlStatement;
import com.darwino.sql.drivers.DBDriver;
import com.darwino.sql.drivers.DBDriverFactory;

/**
 * Database DDL Generator.
 * 
 * This is a developer helper class used to generate the DDL manually and deploy it using
 * existing database tools by an administrator.  
 */
public class AppDDLGenerator {
	
	private DBDriver dbDriver;
	private String schema;
	private JdbcDatabaseCustomizer customizer;
	
	private AppDDLGenerator(DBDriver dbDriver, String schema, JdbcDatabaseCustomizer customizer) {
		this.dbDriver = dbDriver;
		this.schema = schema;
		this.customizer = customizer;
	}
	
	public void generateAll(PrintStream ps) throws SQLException, JsonException {
		DarwinoManifest mf = new AppManifest(null);
		String[] databases = mf.getDatabases();
		for(int i=0; i<databases.length; i++) {
			generate(ps, databases[i]);
		}
	}
	public void generate(PrintStream ps, String dbName) throws SQLException, JsonException {
		DBGenerator sc = new DBGenerator(dbDriver,schema,dbName);
		MetaDatabase database = sc.createDatabase();
		DDLOptions options = customizer!=null ? customizer.getDDLOptions() : null;
		
		// Add the customization DDL to the database meta
		if(customizer!=null) {
			List<String> ddl = new ArrayList<String>();
			customizer.getAlterStatements(ddl, schema, dbName, 0);
			for(String st: ddl) {
				database.addSqlStatement(new MetaSqlStatement(st));
			}
		}

		DDLGenerator gen = dbDriver.getDDLGenerator(options);
		List<String> ddl = gen.generateDDL(database);
		
		ps.println("-- DDL for database: "+dbName);
		ps.println("-- RDBMS type: "+dbDriver.getDatabaseType());
		for(String s: ddl) {
			ps.println(s);
		}
	}

	public static void main(String[] args) {
		try {
			// Set the parameters here
			String dbType = DBDriverFactory.DB_POSTGRESQL;
			String dbVersion = "10.5"; // Null means default
			String dbSchema = null; // Schema for the tables
			
			// Load the driver for the desired DB here
			DBDriver dbDriver = DBDriverFactory.get().find(dbType,dbVersion);

			// Create the customizer
			JdbcDatabaseCustomizer cutomizer = new AppDatabaseCustomizer(dbDriver);
			
			// Create the generator
			AppDDLGenerator gen = new AppDDLGenerator(dbDriver, dbSchema, cutomizer);

			// Generate the DDL to System.out (Java console)
			gen.generateAll(System.out);
			
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
}
