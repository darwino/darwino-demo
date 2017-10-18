/*!COPYRIGHT HEADER! 
 *
 */

package com.contacts.app;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.extensions.DefaultExtensionRegistry;
import com.darwino.jsonstore.extensions.DocumentEvents;
import com.darwino.jsonstore.impl.DarwinoInfCursorFactory;
import com.darwino.jsonstore.local.DefaultDatabaseACLFactory;

/**
 * Database Business logic - event handlers.
 * 
 * @author Philippe Riand
 */
public  class AppDBBusinessLogic extends DefaultExtensionRegistry {
	
	@SuppressWarnings("unused")
	public AppDBBusinessLogic() {
		// Add here the database events to register to the JSON store
		registerDocumentEvents(AppDatabaseDef.DATABASE_NAME, Database.STORE_DEFAULT, new DocumentEvents() {
			@Override
			public void queryNewDocument(Store store, String unid) throws JsonException {
				Platform.log("QueryNewDocument, Database={0}, Store={1}, Unid={2}",store.getDatabase().getId(),store.getId(),unid);
			}
			@Override
			public void postNewDocument(Document doc) throws JsonException {
				Platform.log("PostNewDocument, Database={0}, Store={1}, Unid={2}",doc.getDatabase().getId(),doc.getStore().getId(),doc.getUnid());
			}
			@Override
			public void queryLoadDocument(Store store, String unid) throws JsonException {
				Platform.log("QueryLoadDocument, Database={0}, Store={1}, Unid={2}",store.getDatabase().getId(),store.getId(),unid);
			}
			@Override
			public void postLoadDocument(Document doc) throws JsonException {
				Platform.log("PostLoadDocument, Database={0}, Store={1}, Unid={2}",doc.getDatabase().getId(),doc.getStore().getId(),doc.getUnid());
			}
			@Override
			public void querySaveDocument(Document doc) throws JsonException {
				Platform.log("QuerySaveDocument, Database={0}, Store={1}, Unid={2}",doc.getDatabase().getId(),doc.getStore().getId(),doc.getUnid());
				if(doc.getProperty("computedValues")!=null) {
					Platform.log("  computedValues={0}",doc.getProperty("computedValues"));
				}
			}
			@Override
			public void postSaveDocument(Document doc) throws JsonException {
				Platform.log("PostSaveDocument, Database={0}, Store={1}, Unid={2}",doc.getDatabase().getId(),doc.getStore().getId(),doc.getUnid());
			}
			@Override
			public void queryDeleteDocument(Document doc) throws JsonException {
				Platform.log("QueryDeleteDocument, Database={0}, Store={1}, Unid={2}",doc.getDatabase().getId(),doc.getStore().getId(),doc.getUnid());
			}
			@Override
			public void postDeleteDocument(Document doc) throws JsonException {
				Platform.log("PostDeleteDocument, Database={0}, Store={1}, Unid={2}",doc.getDatabase().getId(),doc.getStore().getId(),doc.getUnid());
			}
		});
		
		// Use a query factory
		setQueryFactory(new DarwinoInfCursorFactory(getClass()));
		
		// Default database ACL factory read the design element coming from Domino
		if(false) {
			setDatabaseACLFactory(new DefaultDatabaseACLFactory());
		}
	}
}
