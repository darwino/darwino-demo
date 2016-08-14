/*!COPYRIGHT HEADER! 
 *
 */

package com.demo.todolist.app;

import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.extensions.DefaultExtensionRegistry;
import com.darwino.jsonstore.extensions.DocumentEvents;
import com.darwino.jsonstore.helpers.SecurityHelper;

/**
 * Database Business logic - event handlers.
 * 
 * @author Philippe Riand
 */
public  class AppDBBusinessLogic extends DefaultExtensionRegistry {
	
	public AppDBBusinessLogic() {
		registerDocumentEvents(AppDatabaseDef.DATABASE_NAME, AppDatabaseDef.STORE_TODO, new DocumentEvents() {
			@Override
			public void querySaveDocument(Document doc) throws JsonException {
				// Manage the security
				//	  owners: can read write any documents
				//	  readers: can read any documents but only write the one they are assigned to, or they created
				SecurityHelper sec = new SecurityHelper(doc);

				sec.removeAllWriters("all");
				sec.removeAllReaders("all");
				sec.addWriter("all","owner");
				sec.addReader("all","member");

				// The creator must be an owner, so we don't need to add him here
				sec.removeAllWriters("users");
				sec.addWriter("users",doc.getString("assigned"));
			}
		});
	}
}
