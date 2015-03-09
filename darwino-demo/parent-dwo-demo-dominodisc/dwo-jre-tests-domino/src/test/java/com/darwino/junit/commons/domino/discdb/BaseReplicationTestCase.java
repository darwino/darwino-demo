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

package com.darwino.junit.commons.domino.discdb;

import java.sql.SQLException;

import com.darwino.commons.Platform;
import com.darwino.commons.httpclnt.HttpClient;
import com.darwino.commons.httpclnt.HttpClientService;
import com.darwino.commons.util.StringUtil;
import com.darwino.demo.dominodisc.DiscDbDatabaseDef;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.meta.DatabaseFactory;
import com.darwino.jsonstore.replication.ReplicationOptions;
import com.darwino.jsonstore.replication.ReplicationResult;
import com.darwino.jsonstore.replication.ReplicatorLocalFromHttp;
import com.darwino.jsonstore.sql.impl.full.DatabaseImpl;
import com.darwino.jsonstore.sql.impl.full.LocalFullJsonDBServerImpl;
import com.darwino.jsonstore.sql.impl.full.SqlContext;
import com.darwino.junit.commons.domino.DominoTestCase;
import com.triloggroup.demo.users.DemoSqlContext;


/**
 *
 */
public abstract class BaseReplicationTestCase extends DominoTestCase {
	
	protected LocalFullJsonDBServerImpl createLocalServer() throws SQLException {
		DemoSqlContext demoContext = new DemoSqlContext();
		SqlContext sqlContext = demoContext.createDefaultSqlContext(null);
		LocalFullJsonDBServerImpl app = new LocalFullJsonDBServerImpl(sqlContext, null);
		return app;
	}

	public void deploy(LocalFullJsonDBServerImpl app) throws Exception {
		String databaseName = DiscDbDatabaseDef.DATABASE_DOMDISC;
		
		if(app.databaseExists(databaseName)) {
			app.undeployDatabase(databaseName);
		}
		
		DatabaseFactory fact = new DiscDbDatabaseDef();
		assertNotNull("Cannot find database factory for "+databaseName,fact);
		app.deployDatabase(DiscDbDatabaseDef.DATABASE_DOMDISC, 1, fact, true);
		assertTrue(app.databaseExists(databaseName));
	}

	public void eraseDatabase(LocalFullJsonDBServerImpl app) throws Exception {
		String databaseName = DiscDbDatabaseDef.DATABASE_DOMDISC;
		
		if(app.databaseExists(databaseName)) {
			Session jsonSession = app.createSystemSession("");
			try {
				jsonSession.getDatabase(databaseName).deleteAllDocuments(true);
			} finally {
				jsonSession.close();
			}
		}
		
		DatabaseFactory fact = new DiscDbDatabaseDef();
		assertNotNull("Cannot find database factory for "+databaseName,fact);
		app.deployDatabase(DiscDbDatabaseDef.DATABASE_DOMDISC, 1, fact, true);
		assertTrue(app.databaseExists(databaseName));
	}
		
	public void replicate(LocalFullJsonDBServerImpl app, boolean eraseJsonData, int maxRepeat) throws Exception {
		Session jsonSession = app.createSystemSession("");
		try {
		DatabaseImpl jsonDb = (DatabaseImpl)jsonSession.getDatabase(DiscDbDatabaseDef.DATABASE_DOMDISC);
		boolean verbose = maxRepeat<=0;
			HttpClient httpClient = Platform.getService(HttpClientService.class).createHttpClient("http://devvm.priand.com/darwino.sync");
			// i==0 to handle when maxrepeat=0
			for(int i=0; i==0 || i<maxRepeat; i++) {
				// And start the replication
				ReplicatorLocalFromHttp rep = new ReplicatorLocalFromHttp(jsonDb, httpClient, "domdisc");
				
				if(i==0 && eraseJsonData) {
					System.out.println(StringUtil.format("Erasing JSON Data"));
					// Make sure that the JSON database is empty
					jsonDb.deleteAllDocuments(true);
					jsonDb.deleteAllReplicationDates();
				}
				
				String label = "Run #"+Integer.toString(i);
				
				ReplicationOptions options = new ReplicationOptions(null);
				options.setReplicationProgress(_createSynchronizationProgress(label,verbose));
				
				// We first push the new changes so if the documents are updated because of some business logic
				// then we'll get the changes in the next pull
				if(pushChanges()) {
					ReplicationResult pushRes = rep.push(options);
					if(pushRes.getAllProcessedCount()>0) {
						System.out.println("Pushed changes from the local database");
						System.out.println(pushRes.toString());
						System.out.println("");
					}
				}
				
				// Pull the latest changes
				if(pullChanges()) {
					ReplicationResult pullRes = rep.pull(options);
					if(pullRes.getAllProcessedCount()>0) {
						System.out.println("Pulled changes from the remote database");
						System.out.println(pullRes.toString());
						System.out.println("");
					}
				}
				
				if(maxRepeat>0) {
					Thread.sleep(2000);
				}
			}
		} finally {
			jsonSession.close();
		}
	}
	
	protected boolean pullChanges() {
		return true;
	}
	
	protected boolean pushChanges() {
		return true;
	}
}
