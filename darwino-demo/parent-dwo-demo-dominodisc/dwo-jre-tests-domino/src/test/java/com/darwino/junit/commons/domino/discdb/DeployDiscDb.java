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

import com.darwino.demo.dominodisc.DiscDbDatabaseDef;
import com.darwino.jsonstore.meta.DatabaseFactory;
import com.darwino.jsonstore.sql.impl.full.LocalFullJsonDBServerImpl;


/**
 *
 */
public class DeployDiscDb extends BaseReplicationTestCase {

	public void testDeploy() throws Exception {
		deploy(DiscDbDatabaseDef.DATABASE_DOMDISC);
	}

	public void deploy(String databaseName) throws Exception {
		LocalFullJsonDBServerImpl app = createLocalServer();
		
		if(app.databaseExists(databaseName)) {
			app.undeployDatabase(databaseName);
		}
		
		DatabaseFactory fact = new DiscDbDatabaseDef();
		assertNotNull("Cannot find database fatcory for "+databaseName,fact);
		app.deployDatabase(DiscDbDatabaseDef.DATABASE_DOMDISC, 1, fact, true);
		assertTrue(app.databaseExists(databaseName));
	}
}
