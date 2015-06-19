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


/**
 * Domino application.
 * 
 * @author Philippe Riand
 */
public class DarwinoApplication /*extends DarwinoDoJ2EEApplication*/ {
	
/*	
	public static DarwinoJ2EEApplication create(ServletContext context) throws JsonException {
		if(!DarwinoJ2EEApplication.isInitialized()) {
			DarwinoApplication app = new DarwinoApplication(
					context,
					new AppManifest(true,new AppJ2EEManifest())
			);
			app.init();
		}
		return DarwinoJ2EEApplication.get();
	}
	
	protected DarwinoApplication(ServletContext context, DarwinoManifest manifest) {
		super(context,manifest);
	}
	
	@Override
	public String[] getConfigurationBeanNames(String type) {
		return new String[] {"Playground",JsonDb.BEAN_LOCAL_NAME,JsonDb.BEAN_DEFAULT_NAME};
	}
*/	
}
