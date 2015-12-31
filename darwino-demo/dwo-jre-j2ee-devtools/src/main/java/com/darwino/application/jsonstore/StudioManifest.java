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

package com.darwino.application.jsonstore;

import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.Session;
import com.darwino.platform.DarwinoContext;
import com.darwino.platform.DarwinoManifest;

/**
 * News Application Manifest.
 * 
 * @author Philippe Riand
 */
public class StudioManifest extends DarwinoManifest {
	
	public static Session getSession() throws JsonException {
		return DarwinoContext.get().getSession();
	}

	
	public StudioManifest() {
	}
	
	/**
	 * No database being returned = all databases can be accessed this way.
	 */
	@Override
	public String[] getDatabases() {
		return null;
	}
	
	@Override
	public String getLabel() {
		return "Darwino Studio";
	}
	
	@Override
	public String getDescription() {
		return "Darwino Web Base Studio";
	}
}
