/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2016.
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

package com.darwino.demo.dominodisc.watson;

import java.util.Date;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.StringArray;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.DocumentCollection;
import com.darwino.jsonstore.LocalJsonDBServer;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.callback.DocumentHandler;
import com.darwino.platform.DarwinoApplication;

/**
 * This class is used to translate the content of documents.
 */
public abstract class BatchDocumentProcessor implements DocumentHandler {

	private String databaseName;
	private String storeName;
	private String[] instances;
	
	// Runtime context
	private Session updateSession;
	private Database database;
	private Document configDoc;
	
	public BatchDocumentProcessor(String databaseName, String storeName, String[] instances) {
		this.databaseName = databaseName;
		this.storeName = storeName;
		this.instances = instances;
	}
	
	public String getDatabaseName() {
		return databaseName;
	}
	
	public String getStoreName() {
		return storeName;
	}
		
	public String getConfigUnid() {
		return getClass().getName();
	}
	
	public String getConfigStore() {
		// We do not want the config doc to be replicated to the mobile device
		//return Database.STORE_DEFAULT;
		return Database.STORE_LOCAL;
	}

	public Session createSession() throws JsonException {
		LocalJsonDBServer srv = DarwinoApplication.get().getLocalJsonDBServer();
		if(!srv.isAvailable()) {
			return null;
		}
 		return srv.createSystemSession(null);
	}

	
	//
	// Runtime properties
	//
	
	public Session getUpdateSession() throws JsonException {
		return updateSession;
	}

	public Database getDatabase() throws JsonException {
		return database;
	}

	public Document getConfigDocument() throws JsonException {
		return configDoc;
	}
	
	public synchronized void execute() throws JsonException {
 		Session session = createSession();
 		if(session!=null) {
			try {
				String[] inst = instances!=null ? instances : StringArray.EMPTY_STRING;
				for(int i=0; i<inst.length; i++) {
					Database db = session.getDatabase(getDatabaseName(),inst[i]);
					execute(db);
				}
			} finally {
				StreamUtil.close(session);
			}
 		}
	}

	public void execute(Database db) throws JsonException {
		this.configDoc = loadConfigDocument(db); 
		try {
			Date newRun = new Date();
			if(configDoc!=null) {
				try {
					Date lastRun = configDoc.getDate("lastRun");
					if(lastRun==null) {
						// temp...
						lastRun = configDoc.getDate("lastTranslate");
						configDoc.remove("lastTranslate");
					}
					execute(db,lastRun,newRun);
				} finally {
					configDoc.set("lastRun", newRun);
					saveConfigDocument(configDoc);
				}
			} else {
				execute(db,null,newRun);
			}
		} finally {
			this.configDoc = null;
		}
	}
	
	public void execute(final Database db, Date lastRun, Date runDate) throws JsonException {
		DocumentCollection c = createDocumentCollection(db, lastRun, runDate);
		try {
			// Execute the translation in a different session so it is outside of the cursor transaction
			// So if the translation fails, then the previous documents are still saved
			this.updateSession = db.getSession().clone();
			try {
				int count = c.findDocuments(this);
				if(count>0) {
					Platform.log("{0} processed {1} documents",getClass().getName(),count);
				}
			} finally {
				StreamUtil.close(updateSession);
				this.updateSession = null;
			}
		} catch(CloneNotSupportedException ex) {
			throw new JsonException(ex);
		}
	}

	
	//
	// Load/Save a config document
	//
	protected Document loadConfigDocument(Database db) throws JsonException {
		String cUnid = getConfigUnid();
		if(StringUtil.isNotEmpty(cUnid)) {
			return db.getStore(getConfigStore()).loadDocument(cUnid, Store.DOCUMENT_CREATE);
		}
		return null;
	}
	
	protected void saveConfigDocument(Document statusDoc) throws JsonException {
		if(statusDoc!=null) {
			statusDoc.save();
		}
	}
	
	protected void deleteConfigDocument(Database db, int options) throws JsonException {
		String cUnid = getConfigUnid();
		if(StringUtil.isNotEmpty(cUnid)) {
			db.getStore(getConfigStore()).deleteDocument(cUnid,options);
		}
	}

	
	//
	// Clear the whole store
	//
	
	public void resetAll(String...stores) throws JsonException {
 		Session session = createSession();
 		if(session!=null) {
			try {
				String[] inst = instances!=null ? instances : StringArray.EMPTY_STRING;
				for(int i=0; i<inst.length; i++) {
					Database db = session.getDatabase(getDatabaseName(),inst[i]);
					reset(db,stores);
				}
			} finally {
				StreamUtil.close(session);
			}
 		}
	}
	public void reset(Database db, String...stores) throws JsonException { 
		deleteConfigDocument(db,Store.DELETE_ERASE);
		if(stores!=null) {
			for(int i=0; i<stores.length; i++) {
				db.getStore(stores[i]).deleteAllDocuments(Store.DELETE_ERASE);
			}
		}
	}
	
	
	//
	// Load/create a target document if it is older than the source doc 
	//
	public Document loadTargetDocument(Document sourceDocument, Store targetStore) throws JsonException {
		if(sourceDocument!=null) {
			Date sd = sourceDocument.getUpdateDate();
			Document targetDocument = targetStore.loadDocument(sourceDocument.getUnid(),Store.DOCUMENT_CREATE);
			if(targetDocument.isNewDocument() || targetDocument.getUpdateDate().getTime()<sd.getTime()) {
				return targetDocument;
			}
		}
		return null;
	}
	
	
	//
	// Create the collection to browse
	//
	protected DocumentCollection createDocumentCollection(Database db, Date lastRun, Date runDate) throws JsonException {
		// Use cdate instead of mdate as it has an index
		Cursor c = db.getStore(getStoreName()).openCursor()
				.orderBy("_udate desc")
				//.hierarchical(99)
				.options(Cursor.RANGE_ROOT);
		int max = maxEntries();
		if(max>0) {
			c.range(0, max);
		}
		if(lastRun!=null) {
			c.query("{_udate: {$gte: '${p1}', $lt: '${p2}'}}").param("p1", lastRun).param("p2", runDate);
		}
		return c;
	}
	protected int maxEntries() {
		return -1;
	}
}
