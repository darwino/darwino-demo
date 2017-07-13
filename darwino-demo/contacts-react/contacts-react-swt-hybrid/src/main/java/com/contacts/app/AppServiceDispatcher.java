/*!COPYRIGHT HEADER! 
 *
 */

package com.contacts.app;


import com.darwino.commons.json.JsonObject;
import com.darwino.commons.services.HttpServerContext;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.services.HttpServiceFactories;
import com.darwino.mobile.hybrid.platform.NanoHttpdDarwinoHttpServer;
import com.darwino.mobile.hybrid.services.MobileDelegateRestFactory;


public class AppServiceDispatcher extends NanoHttpdDarwinoHttpServer {
	
	public AppServiceDispatcher(HttpServerContext context) {
		super(context);
	}
	
	@Override
	public void addApplicationServiceFactories(HttpServiceFactories factories) {
		// The service should be executed locally or remotely (proxy), depending on the current mode
		factories.add(new MobileDelegateRestFactory(new AppServiceFactory() {
			@Override
			protected void addAppInfo(HttpServiceContext context, JsonObject info) {
				super.addAppInfo(context,info);
				// >>>> Add application specific information here <<<<
			}
			@Override
			protected void addProperties(HttpServiceContext context, JsonObject props) {
				super.addProperties(context,props);
				// >>>> Add application specific properties here <<<<
			}
		}));
	}
}
