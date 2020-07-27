/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app;

import java.util.List;

import com.darwino.commons.platform.impl.PluginImpl;
import com.darwino.commons.security.acl.UserService;
import com.darwino.j2ee.servlet.authentication.AuthenticationService;



/**
 * J2EE Plugin for registering the services.
 */
public class AppPlugin extends PluginImpl {
	
	public AppPlugin() {
		super("J2EE Application");
	}

	@Override
	public void findExtensions(Class<?> serviceClass, List<Object> extensions) {
		AppBasePlugin.findExtensions(serviceClass, extensions);
		
		if(serviceClass==AuthenticationService.class) {
			// User authentication service
			// This service grabs the currently authenticated user from the server context
			// By default it uses the J2EE Principal as provided by the application server, but
			// this can be changed to use alternate authentication methods
			//extensions.add(new AuthenticationService() {
			//	@Override
			//	protected boolean forceHttpSession() {
			//		// We have to set this property to ensure that the basic authentication is kept even
			//		// when the client hits a non protected resource.
			//		return true;
			//	}
			//});
		} else if(serviceClass==UserService.class) {
			// User service
			// This service can point to an LDAP server or a static directory
			// The default uses a bean like bellow
			//extensions.add(new UserServiceBeanDelegate());
		}
		
		super.findExtensions(serviceClass, extensions);
	}
}
