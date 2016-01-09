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

package com.darwino.platform.web.tools;

import java.util.List;

import com.darwino.commons.platform.impl.PluginImpl;
import com.darwino.commons.services.rest.RestServiceExtension;
import com.darwino.platform.web.tools.services.JsonStoreServiceExtension;



/**
 * Plug-in implementation.
 */
public final class PluginDarwinoWebTools extends PluginImpl {
	
	public PluginDarwinoWebTools() {
		super("DarwinoWebTools");
	}

	@Override
	public void findExtensions(Class<?> serviceClass, List<Object> extensions) {
		if(serviceClass==RestServiceExtension.class) {
			extensions.add(new JsonStoreServiceExtension());
		}
	}
}
