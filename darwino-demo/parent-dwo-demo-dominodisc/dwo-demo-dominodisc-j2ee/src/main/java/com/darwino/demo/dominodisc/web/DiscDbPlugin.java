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

package com.darwino.demo.dominodisc.web;

import java.util.List;

import com.darwino.commons.platform.beans.ManagedBeansExtension;
import com.darwino.commons.platform.impl.PluginImpl;
import com.darwino.commons.platform.properties.PropertiesExtension;
import com.darwino.ibm.services.social.connections.ConnectionsSocialServiceFactory;
import com.darwino.j2ee.platform.DefaultWebBeanExtension;
import com.darwino.j2ee.platform.DefaultWebPropertiesExtension;
import com.darwino.services.social.SocialServiceFactory;



/**
 * J2EE Plugin for registering the services.
 */
public class DiscDbPlugin extends PluginImpl {
	
	public DiscDbPlugin() {
		super("J2EE Application");
	}

	@Override
	public void findExtensions(Class<?> serviceClass, List<Object> extensions) {
		if(serviceClass==SocialServiceFactory.class) {
			extensions.add(new ConnectionsSocialServiceFactory());
		} else if(serviceClass==ManagedBeansExtension.class) {
			extensions.add(new DefaultWebBeanExtension());
		} else if(serviceClass==PropertiesExtension.class) {
			extensions.add(new DefaultWebPropertiesExtension());
		}
	}
}
