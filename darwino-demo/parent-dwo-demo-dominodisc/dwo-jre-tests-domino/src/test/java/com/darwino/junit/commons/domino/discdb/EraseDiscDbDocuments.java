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

import com.darwino.jsonstore.sql.impl.full.LocalFullJsonDBServerImpl;


/**
 *
 */
public class EraseDiscDbDocuments extends BaseReplicationTestCase {

	public void testErase() throws Exception {
		LocalFullJsonDBServerImpl app = createLocalServer();
		eraseDatabase(app);
	}
}
