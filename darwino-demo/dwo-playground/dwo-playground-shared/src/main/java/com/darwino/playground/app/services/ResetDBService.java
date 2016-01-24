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

package com.darwino.playground.app.services;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.services.HttpService;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.services.HttpServiceError;
import com.darwino.jsonstore.Session;
import com.darwino.platform.DarwinoContext;
import com.darwino.playground.app.services.pinball.PinballInitialization;


/**
 * Reset DB Service.
 * 
 * @author Philippe Riand
 */
public class ResetDBService extends HttpService {

	public ResetDBService() {
	}
	
	@Override
	public void service(HttpServiceContext context) {
		if(context.isGet()) {
	    	try {
	        	final Session jsonSession = DarwinoContext.get().getSession();
	        	PinballInitialization pi = new PinballInitialization();
	        	JsonObject o = pi.init(jsonSession);
				context.emitJson(o);
			} catch (Exception e) {
				Platform.log(e);
				HttpServiceError.error500(e);
			}
		} else {
			throw HttpServiceError.errorUnsupportedMethod(context.getMethod());
		}
	}
}
