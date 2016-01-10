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

package com.darwino.platform.web.tools.services;

import com.darwino.commons.services.rest.RestServiceContributor;
import com.darwino.commons.services.rest.RestServiceExtension;
import com.darwino.commons.services.rest.RestServiceFactory;
import com.darwino.jsonstore.services.JsonStoreServiceFactory;
import com.darwino.platform.web.tools.services.grid.GridCursorServiceContributor;


/**
 * Extension for UI controls.
 * 
 * @author priand
 */
public class JsonStoreServiceExtension extends RestServiceExtension {

	@Override
	public RestServiceContributor getServiceContributor(RestServiceFactory factory) {
		if(factory instanceof JsonStoreServiceFactory) {
			return new GridCursorServiceContributor((JsonStoreServiceFactory)factory);
		}
		return null;
	}
}
