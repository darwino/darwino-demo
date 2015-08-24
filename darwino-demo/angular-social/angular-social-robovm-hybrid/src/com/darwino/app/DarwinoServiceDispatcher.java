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

package com.darwino.app;


import com.darwino.commons.services.HttpServerContext;
import com.darwino.commons.services.HttpServiceFactories;
import com.darwino.mobile.hybrid.platform.DarwinoHttpServer;
import com.darwino.mobile.hybrid.services.MobileDelegateRestFactory;


public class DarwinoServiceDispatcher extends DarwinoHttpServer {
	
	public DarwinoServiceDispatcher(HttpServerContext context) {
		super(context);
	}
	
	@Override
	public void addApplicationServiceFactories(HttpServiceFactories factories) {
		// The service should be executed locally or remotely (proxy), depending on the current mode
		factories.add(new MobileDelegateRestFactory(new AppServiceFactory()));
	}
}
