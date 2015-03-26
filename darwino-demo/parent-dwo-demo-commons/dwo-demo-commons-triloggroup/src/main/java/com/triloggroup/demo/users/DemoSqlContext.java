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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.Version;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.demo.config.DemoConfiguration;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;
import com.darwino.jdbc.connector.JdbcConnector;
import com.darwino.jdbc.pool.bonecp.JdbcBoneCPConnector;
import com.darwino.jdbc.pool.hikaricp.JdbcHikariCPConnector;
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
		DB2("db2"),
		POSTGRES("postgresql");
		
		private final String[] jdbcName_;
		
		private DB(String... jdbcName) {
			jdbcName_ = jdbcName;
		}
		
		public boolean matches(String jdbcName) {
			for(String name : jdbcName_) {
				if(name.equals(jdbcName)) {
					return true;
				}
			}
			return false;
		}
		
		public static DB valueForJdbcName(String jdbcName) {
			for(DB db : values()) {
				if(db.matches(jdbcName)) {
					return db;
				}
			}
			return null;
		}
	}
	
	public enum CP {
		BoneCP,
		HikariCP
	}
	
	//public static final DB db = DB.DB2;
	public static final DB defaultDb = DB.POSTGRES;
	
	public static final CP cp = CP.BoneCP;
	//public static final CP cp = CP.HikariCP;
	
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
		
		// If not Bluemix, consult the config
		DemoConfiguration config = DemoConfiguration.get();
		String url = config.getProperty("darwino.jdbc.url");
		if(StringUtil.isEmpty(url)) {
			throw new IllegalStateException("Could not locate JDBC URL");
		}
		// TODO Is this a good idea?
		Pattern dbTypePattern = Pattern.compile("^jdbc:([^:]+):.*$");
		Matcher dbTypeMatcher = dbTypePattern.matcher(url);
		if(!dbTypeMatcher.matches()) {
			throw new IllegalStateException("Illegal JDBC URL: " + url);
		}
		String dbType = dbTypeMatcher.group(1);
		DB db = DB.valueForJdbcName(dbType);
		if(db == null) {
			throw new IllegalStateException("Unsupported JDBC type: " + dbType);
		}
		
		String user = config.getProperty("darwino.jdbc.user");
		String pwd = config.getProperty("darwino.jdbc.password");
		
		switch(db) {
			case POSTGRES: {
				Properties props = new Properties();
				DBDriver dbDriver = new PostgreSQLDriver(new Version(9,4));
				JdbcConnector connector = createConnector(JdbcConnector.TRANSACTION_READ_COMMITTED,dbDriver,url,user,pwd,props);
				return SqlJdbcContext.create(dbDriver,connector,null);
			}
			case DB2: {
				Properties props = new Properties();
				DBDriver dbDriver = new DB2Driver(new Version(10,5));
				JdbcConnector connector = createConnector(JdbcConnector.TRANSACTION_READ_COMMITTED,dbDriver,url,user,pwd,props);
				return SqlJdbcContext.create(dbDriver,connector,null);
			}
		}
		throw new RuntimeException("No default database setup");
	}
	
	protected JdbcConnector createConnector(int transactionMode, DBDriver dbDriver, String url, String user, String pwd, Properties props) throws SQLException {
		switch(cp) {
			case BoneCP: {
				return new JdbcBoneCPConnector(transactionMode,dbDriver.getDriverClass(),url,user,pwd,props);
			}
			case HikariCP: {
				return new JdbcHikariCPConnector(transactionMode,dbDriver.getDriverClass(),url,user,pwd,props);
			}
		}
		throw new RuntimeException("No default Connection Pool setup");
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
