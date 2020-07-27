/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app;

import java.util.List;

import com.darwino.commons.microservices.JsonMicroServiceFactory;
import com.darwino.commons.platform.beans.ManagedBeansExtension;
import com.darwino.commons.platform.properties.PropertiesExtension;
import com.darwino.commons.services.HttpServiceFactory;
import com.darwino.commons.util.security.PasswordHash;
import com.darwinodb.app.beans.HttpConnectionBeanExtension;
import com.darwinodb.app.platform.AppPasswordHash;
import com.darwinodb.app.platform.WebBeanExtension;
import com.darwinodb.app.platform.WebPropertiesExtension;



/**
 * Main plugin class.
 * 
 * This class is used to register the common plugin services and is meant to be overloaded
 * by an actual implementation (J2EE, Mobile...).
 */
public class AppBasePlugin {
	
	public static void findExtensions(Class<?> serviceClass, List<Object> extensions) {
		if(serviceClass==HttpServiceFactory.class) {
			extensions.add(new AppRestServiceFactory());
		} else if(serviceClass==PasswordHash.class) {
			extensions.add(AppPasswordHash.get());
		} else if(serviceClass==JsonMicroServiceFactory.class) {
			extensions.add(new AppMicroServicesFactory());
		} else if(serviceClass==ManagedBeansExtension.class) {
			extensions.add(new HttpConnectionBeanExtension());
			extensions.add(new WebBeanExtension());
		} else if(serviceClass==PropertiesExtension.class) {
			extensions.add(new WebPropertiesExtension());
		}
	}
}
