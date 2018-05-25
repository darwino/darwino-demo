/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
import com.darwino.jsonstore.sql.jsql.query.DarwinoInfJsqQueryFactory;

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
		
		// Use a query factories, for cursors and JSQL
		setQueryFactory(new DarwinoInfCursorFactory(getClass()));
		setJsqlQueryFactory(new DarwinoInfJsqQueryFactory(getClass()));
		
		// Default database ACL factory read the design element coming from Domino
		if(false) {
			setDatabaseACLFactory(new DefaultDatabaseACLFactory());
		}
	}
}
