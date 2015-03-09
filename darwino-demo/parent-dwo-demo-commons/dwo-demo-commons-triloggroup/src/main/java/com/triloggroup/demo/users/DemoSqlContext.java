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

package com.triloggroup.demo.users;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.Properties;

import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.Version;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;
import com.darwino.jdbc.connector.JdbcConnector;
import com.darwino.jdbc.pool.bonecp.JdbcBoneCPConnector;
import com.darwino.jsonstore.sql.impl.full.SqlContext;
import com.darwino.jsonstore.sql.impl.full.context.SqlJdbcContext;
import com.darwino.platforms.bluemix.JdbcBluemixConnector;
import com.darwino.sql.drivers.DBDriver;
import com.darwino.sql.drivers.db2.DB2Driver;
import com.darwino.sql.drivers.postgresql.PostgreSQLDriver;
import com.darwino.sql.util.SQLExceptionEx;

/**
 * Create a common SQLContext.
 * 
 * @author Philippe Riand
 */
public class DemoSqlContext {
	
	public enum DB {
		DB2,
		POSTGRES
	}
	
	//public static final DB db = DB.DB2;
	public static final DB db = DB.POSTGRES;
	
	public DemoSqlContext() {
	}
	
	@SuppressWarnings("resource")
	public SqlContext createDefaultSqlContext(DarwinoJ2EEApplication application) throws SQLException {
		// Check if we are running a local liberty server
		if(isDBBluemix()) {
			try {
				String vcap = getBluemixVarCap();
				if(StringUtil.isNotEmpty(vcap)) {
					JdbcBluemixConnector connector = new JdbcBluemixConnector(JdbcConnector.TRANSACTION_READ_COMMITTED,vcap);
					if(connector.getDBDriver()==null) {
						throw new SQLExceptionEx(null,"No database service is configured in IBM Bluemix for the application");
					}
					return SqlJdbcContext.create(connector.getDBDriver(),connector,null);
				}
			} catch (IOException e) {
				throw new SQLException(e);
			}
		}
		
		switch(db) {
			case POSTGRES: {
				String user = "postgres"; 
				String pwd = "postgres";
				String url = "jdbc:postgresql://localhost:5434/dwodemo";
				Properties props = new Properties();
				DBDriver dbDriver = new PostgreSQLDriver(new Version(9,4));
				JdbcConnector connector = new JdbcBoneCPConnector(JdbcConnector.TRANSACTION_READ_COMMITTED,dbDriver.getDriverClass(),url,user,pwd,props);
				return SqlJdbcContext.create(dbDriver,connector,null);
			}
			case DB2: {
				String user = "db2admin"; 
				String pwd = "passw0rd";
				String url = "jdbc:db2://" + "localhost:50000/dwodemo";
				Properties props = new Properties();
				DBDriver dbDriver = new DB2Driver(new Version(10,5));
				JdbcConnector connector = new JdbcBoneCPConnector(JdbcConnector.TRANSACTION_READ_COMMITTED,dbDriver.getDriverClass(),url,user,pwd,props);
				return SqlJdbcContext.create(dbDriver,connector,null);
			}
		}
		throw new RuntimeException("No default database setup");
	}

	
	//
	// Utilities
	//
	public boolean isLocalLiberty() {
		String p = System.getProperty("wlp.server.name");
		return StringUtil.isNotEmpty(p);
	}
	public boolean isDBBluemix() {
		return isLocalLiberty();
	}	
	public String getBluemixVarCap() throws IOException {
		String json = "Bluemix-news.json";
		InputStream is = getClass().getResourceAsStream(json);
		if(is!=null) {
			try {
				return StreamUtil.readString(is, "UTF-8");
			} finally {
				StreamUtil.close(is);
			}
		}
		return null;
	}	
}
