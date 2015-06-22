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
import com.darwino.services.social.SocialServiceFactory;
import com.darwino.services.social.basic.BasicSocialServiceFactory;



/**
 * Domino Plugin for registering the services.
 */
public class AppPlugin extends PluginImpl {
	
	public AppPlugin() {
		super("Domino Application");
	}

	@Override
	public void findExtensions(Class<?> serviceClass, List<Object> extensions) {
		if(serviceClass==SocialServiceFactory.class) {
			extensions.add(new BasicSocialServiceFactory()); // Basic factory, just the user service
//		} else if(serviceClass==AuthenticationService.class) {
//			// User authentication service
//			// This service grabs the currently authenticated user from the server context
//			// By default it uses the J2EE Principal as provided by the application server, but
//			// this can be changed to use alternate authentication methods
//			//extensions.add(new AppAuthenticationService());
//		} else if(serviceClass==UserService.class) {
//			// User service
//			// This service can point to an LDAP server or a static directory
//			extensions.add(new AppUserService());
//		} else if(serviceClass==ManagedBeansExtension.class) {
//			// Ok, default web entries - can be replaced by something more accurate
//			extensions.add(new DefaultWebBeanExtension());
//		} else if(serviceClass==PropertiesExtension.class) {
//			// Ok, default web entries - can be replaced by something more accurate
//			extensions.add(new DefaultWebPropertiesExtension());
///*			
//		} else if(serviceClass==AuthenticationService.class) {
//			extensions.add(new AuthenticationService() {
//				@Override
//				protected boolean forceHttpSession() {
//					// We have to set this property to ensure that the basic authentication is kept even
//					// when the client hits a non protected resource.
//					return true;
//				}
//			});
//*/			
		}
	}
}
