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

import java.sql.SQLException;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.security.acl.UserService;
import com.darwino.demo.users.DemoSqlContext;
import com.darwino.demo.users.StaticTomcatUserService;
import com.darwino.ibm.services.social.connections.ConnectionsSocialServiceFactory;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;
import com.darwino.jsonstore.sql.impl.full.SqlContext;
import com.darwino.platform.DarwinoManifest;
import com.darwino.services.social.SocialServiceFactory;

/**
 * J2EE application.
 * 
 * @author Philippe Riand
 */
public class DiscDbJ2EEApplication extends DarwinoJ2EEApplication {
	
	public DiscDbJ2EEApplication(DarwinoManifest manifest) {
		super(manifest);
		
		// Register the services
		ConnectionsSocialServiceFactory sc = new ConnectionsSocialServiceFactory() ;
		Platform.registerService(SocialServiceFactory.class, sc);
		Platform.registerService(UserService.class, new StaticTomcatUserService());
	}
	
	@Override
	protected SqlContext createDefaultSqlContext() throws JsonException, SQLException {
		DemoSqlContext demoContext = new DemoSqlContext();
		return demoContext.createDefaultSqlContext(this);
	}
}
