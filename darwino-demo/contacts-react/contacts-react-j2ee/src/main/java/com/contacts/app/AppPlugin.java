/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package com.contacts.app;

import java.util.List;

import com.darwino.commons.platform.beans.ManagedBeansExtension;
import com.darwino.commons.platform.properties.PropertiesExtension;
import com.darwino.commons.security.acl.UserService;
import com.darwino.j2ee.platform.DefaultWebBeanExtension;
import com.darwino.j2ee.platform.DefaultWebPropertiesExtension;
import com.darwino.j2ee.servlet.authentication.AuthenticationService;



/**
 * J2EE Plugin for registering the services.
 */
public class AppPlugin extends AppBasePlugin {
	
	public AppPlugin() {
		super("J2EE Application");
	}

	@Override
	public void findExtensions(Class<?> serviceClass, List<Object> extensions) {
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
		} else if(serviceClass==ManagedBeansExtension.class) {
			// Ok, default web entries - can be replaced by something more accurate
			extensions.add(new DefaultWebBeanExtension());
		} else if(serviceClass==PropertiesExtension.class) {
			// Ok, default web entries - can be replaced by something more accurate
			extensions.add(new DefaultWebPropertiesExtension());
		}
		
		super.findExtensions(serviceClass, extensions);
	}
}
