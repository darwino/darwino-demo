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

package com.darwino.shell;

import java.util.List;

import com.darwino.commons.platform.beans.ManagedBeansExtension;
import com.darwino.commons.platform.impl.PluginImpl;
import com.darwino.commons.platform.properties.PropertiesExtension;
import com.darwino.commons.security.acl.UserService;
import com.darwino.shell.extensions.ConfigExtension;



/**
 * Plug-in.
 */
public class PluginShell extends PluginImpl {
	
	public PluginShell() {
		super("JSON store shell");
	}

	@Override
	public Object findDefaultService(Class<?> serviceClass) {
		// Unless a user service is explicitly set, we use a bean based one
		if(serviceClass==UserService.class) {
			return findServiceAsBean(UserService.BEAN_TYPE);
		}
		return null;
	}
	
	@Override
	public void findExtensions(Class<?> serviceClass, List<Object> extensions) {
		if(serviceClass==ManagedBeansExtension.class) {
			extensions.add(ConfigExtension.instance);
		} else if(serviceClass==PropertiesExtension.class) {
			extensions.add(ConfigExtension.instance);
		}
	}
}
