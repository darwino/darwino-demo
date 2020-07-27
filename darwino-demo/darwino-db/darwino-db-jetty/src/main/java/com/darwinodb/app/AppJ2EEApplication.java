/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app;

import javax.servlet.ServletContext;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.platform.ManagedBeansService;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;
import com.darwino.jsonstore.LocalJsonDBServer;
import com.darwino.jsonstore.extensions.MetadataEvents;
import com.darwino.jsonstore.meta.DatabaseCustomizer;
import com.darwino.jsonstore.sql.impl.full.LocalFullJsonDBServerImpl;
import com.darwino.platform.DarwinoManifest;
import com.darwino.sql.drivers.DBDriver;
import com.darwino.sqlite.JreInstall;
import com.darwinodb.app.scripts.NotificationCenter;

/**
 * J2EE application.
 */
public class AppJ2EEApplication extends DarwinoJ2EEApplication {
	
	public static DarwinoJ2EEApplication create(ServletContext context) throws JsonException {
		if(!DarwinoJ2EEApplication.isInitialized()) {
			AppJ2EEApplication app = new AppJ2EEApplication(
					context,
					new AppManifest(new AppJ2EEManifest())
			);
			app.init();
		}
		return DarwinoJ2EEApplication.get();
	}
	

	protected AppJ2EEApplication(ServletContext context, DarwinoManifest manifest) {
		super(context,manifest);
		
		JreInstall.init();
	}
	
	// May be not the best place here...
	@Override
	protected LocalFullJsonDBServerImpl initLocalDBServer() throws JsonException {
		LocalFullJsonDBServerImpl server = super.initLocalDBServer();

		// Done here as this is not shared with an eventual mobile app (no socket available)
		AppDBBusinessLogic bl = (AppDBBusinessLogic)server.getExtensionRegistry();
		bl.setMetadataEvents(new MetadataEvents() {
			@Override
			public void postDeployDatabase(LocalJsonDBServer server, String database) throws JsonException {
				notifyMetadataChanged();
			}
			@Override
			public void postUnDeployDatabase(LocalJsonDBServer server, String database) throws JsonException {
				notifyMetadataChanged();
			}
			private void notifyMetadataChanged() {
				NotificationCenter.get().notifyMetadataChanged(null);
			}
		});
		return server;
	}
	
	
	@Override
	public String[] getConfigurationBeanNames() {
		return new String[] {getManifest().getConfigId(),ManagedBeansService.LOCAL_NAME,ManagedBeansService.DEFAULT_NAME};
	}
	
	@Override
	protected DatabaseCustomizer findDatabaseCustomizerFactory(DBDriver driver, String dbName) {
		return new AppDatabaseCustomizer(driver); 
	}
	
}
