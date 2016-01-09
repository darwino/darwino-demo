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

package com.darwino.platform.web;

import java.util.List;

import com.darwino.commons.platform.impl.PluginImpl;
import com.darwino.platform.resources.DarwinoWebLibraryExtension;



/**
 * Plug-in implementation.
 */
public final class PluginDarwinoDemoWeb extends PluginImpl {
	
	public PluginDarwinoDemoWeb() {
		super("DarwinoDemoWeb");
	}

	@Override
	public void findExtensions(Class<?> serviceClass, List<Object> extensions) {
		if(serviceClass==DarwinoWebLibraryExtension.class) {
			extensions.add(new DarwinoDemoWebPathExtension());
		}
	}
}
