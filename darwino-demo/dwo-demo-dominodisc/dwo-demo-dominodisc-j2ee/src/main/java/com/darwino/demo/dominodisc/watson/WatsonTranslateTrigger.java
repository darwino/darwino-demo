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
import com.darwino.commons.util.text.HtmlTextUtil;
import com.darwino.demo.dominodisc.app.AppDatabaseDef;
import com.darwino.ibm.watson.LanguageTranslationFactory;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.Store;
import com.darwino.platform.DarwinoApplication;
import com.darwino.platform.events.EventException;
import com.darwino.platform.events.EventTrigger;
import com.darwino.platform.events.jsonstore.JsonStoreChangesTrigger;
import com.darwino.platform.events.jsonstore.AbstractJsonStoreDocumentTrigger;
import com.ibm.watson.developer_cloud.language_translation.v2.LanguageTranslation;
import com.ibm.watson.developer_cloud.language_translation.v2.model.Language;

/**
 * This class is used to translate the content of documents.
 */
public class WatsonTranslateTrigger extends JsonStoreChangesTrigger {

	// For debugging without effectively calling Watson..
	private static final boolean FAKE = false;
	
	public static EventTrigger<?> create(DarwinoApplication application, String[] instances) {
		if(!Platform.getPropertyService().getPropertyBoolean("discdb.watson.translate")) {
			return null;
		}
		
		// A service must exists
		LanguageTranslationFactory factory = Platform.getManagedBeanUnchecked(LanguageTranslationFactory.BEAN_TYPE);
		if(factory==null) {
			Platform.log("Cannot find a factory for the Watson LanguageTranslation service");
			return null;
		}

		Platform.log(">>> Watson translation handler installed");
		return new WatsonTranslateTrigger()
			.scheduler("5s")
			.database(AppDatabaseDef.DATABASE_NAME)
			.store(AppDatabaseDef.STORE_NSFDATA)
			.instances(instances)
			.maxEntries(8)
			.handler(new Handler(factory));
	}

	public WatsonTranslateTrigger() {
	}
	
	public void clearTranslations() throws JsonException {
		Platform.log(">>> Watson translation cleared");
		Session session = createSession();
		try {
			String[] ins = StringArray.isEmpty(getInstances()) ? StringArray.EMPTY_STRING : getInstances();
			for(int i=0; i<ins.length; i++) {
				Database db = session.getDatabase(AppDatabaseDef.DATABASE_NAME,ins[i]);
				db.getStore(AppDatabaseDef.STORE_NSFDATA_FR).deleteAllDocuments();
				db.getStore(AppDatabaseDef.STORE_NSFDATA_ES).deleteAllDocuments();
			}
		} finally {
			StreamUtil.close(session);
		}
	}

	
	public static class Handler implements AbstractJsonStoreDocumentTrigger.Handler {
	
		private LanguageTranslationFactory factory;
		
		public Handler(LanguageTranslationFactory factory) {
			this.factory = factory;
		}
	
		@Override
		public void handle(Document doc) throws JsonException, EventException {
			//Platform.log("Translate document, id={0}",doc.getUnid());
			translate(doc);
		}
		
		public boolean translate(Document document) throws JsonException {
			final LanguageTranslation tr = factory.createLanguageTranslation();
			
			String subject = document.getString("subject");
			String bodyText = HtmlTextUtil.fromHTML(document.getString("body")); // Watson does not translate HTML!
			{
				Document translated = loadTargetDocument(document,document.getDatabase().getStore(AppDatabaseDef.STORE_NSFDATA_FR));
				if(translated!=null) {
					Platform.log("Translating to French: {0}, date {1}, inst {2}",document.getUnid(),document.getUpdateDate(),document.getStore().getDatabase().getInstance().getId());
					translated.setSyncMaster(document);
					String newSubject = translate(tr, subject, Language.ENGLISH, Language.FRENCH);
					String newBody = translate(tr, bodyText, Language.ENGLISH, Language.FRENCH);
					
					translated.set("subject", newSubject);
					translated.set("body", StringUtil.isNotEmpty(newBody) ? HtmlTextUtil.toHTMLContentString(newBody,true) : "");
					translated.set("abstract", StringUtil.isNotEmpty(newBody) ? newBody.substring(0,Math.min(newBody.length(),200)) : "");
					translated.save();
				} else {
					Platform.log("Skip translating to French: {0}, date {1}, inst {2}",document.getUnid(),document.getUpdateDate(),document.getStore().getDatabase().getInstance().getId());
				}
			}
			{
				Document translated = loadTargetDocument(document,document.getDatabase().getStore(AppDatabaseDef.STORE_NSFDATA_ES));
				if(translated!=null) {
					Platform.log("Translating to Spanish: {0}, date {1}, inst {2}",document.getUnid(),document.getUpdateDate(),document.getStore().getDatabase().getInstance().getId());
					translated.setSyncMaster(document);
					String newSubject = translate(tr, subject, Language.ENGLISH, Language.SPANISH);
					String newBody = translate(tr, bodyText, Language.ENGLISH, Language.SPANISH);
					
					translated.set("subject", newSubject);
					translated.set("body", HtmlTextUtil.toHTMLContentString(newBody,true));
					translated.set("abstract", newBody.substring(0,Math.min(newBody.length(),200)));
					translated.save();
				} else {
					Platform.log("Skip translating to Spanish: {0}, date {1}, inst {2}",document.getUnid(),document.getUpdateDate(),document.getStore().getDatabase().getInstance().getId());
				}
			}
			return true; // continue
		}
	
		private String translate(LanguageTranslation tr, String text, Language source, Language target) {
			// In case the translation fails, then keeps the original string...
			try {
				if(!FAKE) {
					return tr.translate(text, source, target).execute().getFirstTranslation();
				}
				return target.toString() + ": " + text; 
			} catch(Exception ex) {
				ex.printStackTrace();
				return text;
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
	}
}
