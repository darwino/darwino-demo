/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.platform.ManagedBeansService.Cleanup;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.security.StringObfuscator;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.extensions.AggregatedDocumentEvents;
import com.darwino.jsonstore.extensions.DefaultExtensionRegistry;
import com.darwino.jsonstore.extensions.DocumentEvents;
import com.darwino.jsonstore.impl.DarwinoInfCursorFactory;
import com.darwino.jsonstore.local.DefaultDatabaseACLFactory;
import com.darwinodb.app.beans.HttpConnectionBeanExtension;

/**
 * Database Business logic - event handlers.
 */
public  class AppDBBusinessLogic extends DefaultExtensionRegistry {
	
	public AppDBBusinessLogic() {
		// Add here the database events to register to the JSON store
//		registerDocumentEvents("<My Database Id>", "<My Store Id>", new DocumentEvents() {
//			@Override
//			public void querySaveDocument(Document doc) throws JsonException {
//			}
//		});
		
		// Use a query factories, for cursors and JSQL
		setQueryFactory(new DarwinoInfCursorFactory(getClass()));
		
		//setJsqlQueryFactory(new DarwinoInfJsqQueryFactory(getClass()));
		setDatabaseACLFactory(new DefaultDatabaseACLFactory());
		
		AggregatedDocumentEvents events = new AggregatedDocumentEvents();
		setDocumentEvents(events);

		// Check changes to the system database
		events.registerDocumentEvents(AppDatabaseDef.DATABASE_NAME, new DocumentEvents() {
			@Override
			public void postNewDocument(Document doc) throws JsonException {
				documentChange(doc.getDatabase(), doc.getStore(), doc.getUnid());
			}
			@Override
			public void querySaveDocument(Document doc) throws JsonException {
				// Obfuscate the
				String pwd = doc.getString("password");
				if(StringUtil.isNotEmpty(pwd)) {
					StringObfuscator ob = Main.get().getStringObfuscator();
					if(!ob.isObfuscated(pwd)) {
						try {
							String ostr = ob.obfuscate(pwd);
							doc.set("password", ostr);
						} catch(Exception e) {
							throw new JsonException(e);
						}
						
					}
				}
			}
			@Override
			public void postSaveDocument(Document doc) throws JsonException {
				documentChange(doc.getDatabase(), doc.getStore(), doc.getUnid());
			}
			@Override
			public void postDeleteDocument(Database database, Store store, String unid, int id) throws JsonException {
				documentChange(database,store,unid);
			}

			private void documentChange(Database database, Store store, String unid) throws JsonException {
				if(store==null || store.getId().equals(AppDatabaseDef.STORE_CONNECTIONS_NAME)) {
					Platform.getManagedBeansService().cleanup(new Cleanup() {
						@Override
						public boolean shouldDispose(int scope, String type, Object bean) {
							boolean dispose = bean instanceof HttpConnectionBeanExtension.DBHttpConnection;
							return dispose;
						}
					});
				}
			}
		});
		
		// Obfuscate the password field for connections
		events.registerDocumentEvents(AppDatabaseDef.DATABASE_NAME, AppDatabaseDef.STORE_CONNECTIONS_NAME, new DocumentEvents() {
			@Override
			public void querySaveDocument(Document doc) throws JsonException {
				String pwd = doc.getString("password");
				if(StringUtil.isNotEmpty(pwd)) {
					StringObfuscator ob = Main.get().getStringObfuscator();
					if(!ob.isObfuscated(pwd)) {
						try {
							String ostr = ob.obfuscate(pwd);
							doc.set("password", ostr);
						} catch(Exception e) {
							throw new JsonException(e);
						}
						
					}
				}
			}
		});
	}
}
