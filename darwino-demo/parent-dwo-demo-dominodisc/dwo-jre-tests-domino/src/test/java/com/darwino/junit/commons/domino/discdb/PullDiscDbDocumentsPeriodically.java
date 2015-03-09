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

import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.sql.impl.full.LocalFullJsonDBServerImpl;


/**
 *
 */
public class PullDiscDbDocumentsPeriodically extends BaseReplicationTestCase {

	public void testSynchronize() throws Exception {
		LocalFullJsonDBServerImpl app = createLocalServer();

		System.out.println(StringUtil.format("Starting replication with the ProjExec Wall\n\n"));
		replicate(app,false,Integer.MAX_VALUE);
	}

	@Override
	protected boolean pullChanges() {
		return true;
	}

	@Override
	protected boolean pushChanges() {
		return false;
	}
}
