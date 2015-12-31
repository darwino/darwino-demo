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

package com.darwino.playground.domino;

import java.util.List;

import com.darwino.commons.platform.impl.PluginImpl;
import com.darwino.commons.preferences.impl.PreferencesExtension;



/**
 * Domino Plugin for registering the services.
 */
public class AppPlugin extends PluginImpl {
	
	public AppPlugin() {
		super("Domino Application");
	}

	@Override
	public void findExtensions(Class<?> serviceClass, List<Object> extensions) {
		if(serviceClass==PreferencesExtension.class) {
			extensions.add(new DemoPreferencesExtension());
		}
	}
}
