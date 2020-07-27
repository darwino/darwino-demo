/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

package com.darwinodb.app.beans;

import java.util.Set;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.platform.beans.ManagedBeansExtension;
import com.darwino.jsonstore.JsonDBServer;
import com.darwino.platform.DarwinoApplication;


/**
 * Database Managed Bean Factory.
 *
 * The beans are created out of database documents.
 * We use the XML formalism as this is simpler and guarantees the same behaviors.
 *  
 * @author Philippe Riand
 */
public abstract class AbstractDatabaseBeanExtension implements ManagedBeansExtension {
	
	public abstract class DatabaseBeanFactory implements BeanFactory {
		
		private int scope;
		private String name;
		
		public DatabaseBeanFactory(int scope, String name) {
			this.scope = scope;
			this.name = name;
		}
		@Override
		public int getScope() {
			return scope;
		}
		@Override
		public String getName() {
			return name;
		}
		@Override
		public String getClassName() {
			// Not needed where the instances are created statically
			return null;
		}
		@Override
		public String[] getAliases() {
			// No aliases when read from the database
			return null;
		}
	}
	
	public AbstractDatabaseBeanExtension() {
	}
	
	
	//
	// This is for debug only, we don't need these functions
	//
	
	@Override
	public void enumerate(Set<String> list, String type, boolean aliases) {
	}
	
	@Override
	public JsonObject getDefinition(String type, String name) {
		return null;
	}
	
	
	//
	// Load a bean based on a document
	//
	
	protected JsonDBServer getJsonDBServer() throws JsonException {
		DarwinoApplication app = DarwinoApplication.get();
		return app.getLocalJsonDBServer();
	}

}
