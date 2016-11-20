/*!COPYRIGHT HEADER! 
 *
 */

package com.darwino.demo.news.app;


import com.darwino.commons.services.HttpServerContext;
import com.darwino.mobile.hybrid.platform.NanoHttpdDarwinoHttpServer;


public class AppServiceDispatcher extends NanoHttpdDarwinoHttpServer {
	
	public AppServiceDispatcher(HttpServerContext context) {
		super(context);
	}
}
