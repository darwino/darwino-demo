/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

package com.darwino.domino.replicator.dbadapter.domdisc;

import com.darwino.commons.log.Logger;
import com.darwino.domino.jstore.dsl.DSLDatabaseAdapterFactory;

public class DatabaseAdapterFactory extends DSLDatabaseAdapterFactory {

	private static final Logger log = Activator.log;

	public DatabaseAdapterFactory() {
		if(log.isInfoEnabled()) {
			log.info("Initializing DomDisc Groovy Adapter!"); //$NON-NLS-1$
		}
	}
	
	@Override
	public String[] getScriptNames() {
		return new String[] { "domdisc" }; //$NON-NLS-1$
	}

}
