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
import com.darwino.commons.tasks.Task;
import com.darwino.commons.tasks.TaskException;
import com.darwino.commons.tasks.TaskExecutorContext;
import com.darwino.commons.tasks.scheduler.TaskScheduler;
import com.darwino.commons.tasks.scheduler.schedulers.IntervalScheduler;
import com.darwino.commons.util.StringArray;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.commons.util.text.HtmlTextUtil;
import com.darwino.demo.dominodisc.app.AppDatabaseDef;
import com.darwino.ibm.watson.LanguageTranslationFactory;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.LocalJsonDBServer;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.callback.DocumentHandler;
import com.darwino.platform.DarwinoApplication;
import com.ibm.watson.developer_cloud.language_translation.v2.LanguageTranslation;
import com.ibm.watson.developer_cloud.language_translation.v2.model.Language;

/**
 * This class is used to translate the content of documents.
 */
public class TranslationTask extends Task<Void> {

	private static final boolean RESTART_FROM_SCRATCH = false;

	public static void install(String[] instances) {
		//return;
		if(!Platform.getPropertyService().getPropertyBoolean("discdb.watson.translate")) {
			return;
		}
		// A service must exists
		LanguageTranslationFactory factory = Platform.findServiceAsBeanUnchecked(LanguageTranslationFactory.BEAN_TYPE, LanguageTranslationFactory.class);
		if(factory==null) {
			Platform.log("Cannot find a factory for the Watson LanguageTranslation service");
			return;
		}
		Platform.log("Start Watson translation service");
		TaskScheduler sc = Platform.getService(TaskScheduler.class);
		IntervalScheduler scheduler = new IntervalScheduler();
		scheduler.setInterval("15s"); // 1 min
		scheduler.setInitialDelay("5s"); // 15 secs
		sc.scheduleTask(new TranslationTask(factory,instances),scheduler);
	}
	
	public static void uninstall() {
	}

	private LanguageTranslationFactory factory;
	private String[] instances;
	private boolean initialized;
	
	public TranslationTask(LanguageTranslationFactory factory, String[] instances) {
		this.factory = factory;
		this.instances = instances;
	}
	
	@Override
	public Void execute(TaskExecutorContext context) throws TaskException {
		try {
			translate();
		} catch(JsonException e) {
			Platform.log(e);
			throw new TaskException(e);
		}
		return null;
	}

	protected void init(Database db, Document statusDoc) throws JsonException {
		// To restart from scratch
		if(RESTART_FROM_SCRATCH) {
			db.getStore(AppDatabaseDef.STORE_NSFDATA_FR).deleteAllDocuments();
			db.getStore(AppDatabaseDef.STORE_NSFDATA_ES).deleteAllDocuments();
			statusDoc.remove("lastTranslate");
		}
	}
	
	public synchronized void translate() throws JsonException {
		LocalJsonDBServer srv = DarwinoApplication.get().getLocalJsonDBServer();
		if(!srv.isAvailable()) {
			return;
		}
 		Session session = srv.createSystemSession(null);
		try {
			Date now = new Date();
			String[] inst = instances!=null ? instances : StringArray.EMPTY_STRING;
			for(int i=0; i<inst.length; i++) {
				Database db = session.getDatabase(AppDatabaseDef.DATABASE_NAME,inst[i]);
				Document statusDoc = db.getStore(Database.STORE_DEFAULT).loadDocument("translate", Store.DOCUMENT_CREATE);
				try {
					if(!initialized) {
						init(db,statusDoc);	
					}
					Date ts = statusDoc.getDate("lastTranslate");
					translate(db,ts);
				} finally {
					statusDoc.set("lastTranslate", now);
					statusDoc.save();
				}
			}
		} finally {
			initialized = true;
			StreamUtil.close(session);
		}
	}
	
	public void translate(final Database db, Date from) throws JsonException {
		// Use cdate instead of mdate as it has an index
		Cursor c = db.getStore(AppDatabaseDef.STORE_NSFDATA).openCursor()
				.orderBy("_cdate desc")
				.hierarchical(99)
				.options(Cursor.RANGE_ROOT)
				.range(0,8);
		if(from!=null) {
			c.query("{_cdate: {$gte: '${p1}'}}").param("p1", from);
		}
		final LanguageTranslation tr = factory.createLanguageTranslation();
		
		try {
			// Execute the translation in a different session so it is outside of the cursor transaction
			// So if the translation fails, then the previous documents are still saved
			final Session updateSession = db.getSession().clone();
			try {
				final int[] count = new int[1];
				c.findDocuments(new DocumentHandler() {
					@Override
					public boolean handle(Document document) throws JsonException {
						Platform.log("Translate: {0}, date {1}, inst {2}",document.getUnid(),document.getLastModificationDate(),document.getStore().getDatabase().getInstance().getId());
						String subject = document.getString("subject");
						String bodyText = HtmlTextUtil.fromHTML(document.getString("body")); // Watson does not translate HTML!
						{
							Document translated = updateSession.getDatabase(db.getId(),db.getInstance().getId()).getStore(AppDatabaseDef.STORE_NSFDATA_FR).loadDocument(document.getUnid(),Store.DOCUMENT_CREATE);
							translated.setSyncMaster(document);
							String newSubject = translate(tr, subject, Language.ENGLISH, Language.FRENCH);
							String newBody = translate(tr, bodyText, Language.ENGLISH, Language.FRENCH);
							//String newSubject = "FRENCH "+subject;
							//String newBody = "FRENCH\n"+bodyText;
							
							translated.set("subject", newSubject);
							translated.set("body", HtmlTextUtil.toHTMLContentString(newBody,true));
							translated.set("abstract", newBody.substring(0,Math.min(newBody.length(),200)));
							translated.save();
						}
						{
							Document translated = updateSession.getDatabase(db.getId(),db.getInstance().getId()).getStore(AppDatabaseDef.STORE_NSFDATA_ES).loadDocument(document.getUnid(),Store.DOCUMENT_CREATE);
							translated.setSyncMaster(document);
							String newSubject = translate(tr, subject, Language.ENGLISH, Language.SPANISH);
							String newBody = translate(tr, bodyText, Language.ENGLISH, Language.SPANISH);
							//String newSubject = "SPANISH "+subject;
							//String newBody = "SPANISH\n"+bodyText;
							
							translated.set("subject", newSubject);
							translated.set("body", HtmlTextUtil.toHTMLContentString(newBody,true));
							translated.set("abstract", newBody.substring(0,Math.min(newBody.length(),200)));
							translated.save();
						}
						count[0]++;
						return true;
					}
				});
				if(count[0]>0) {
					Platform.log("Translated {0} documents");
				}
			} finally {
				StreamUtil.close(updateSession);
			}
		} catch(CloneNotSupportedException ex) {
			throw new JsonException(ex);
		}
	}
	private String translate(LanguageTranslation tr, String text, Language source, Language target) {
		// In case the translation fails, then keeps the same string...
		try {
			return tr.translate(text, source, target).execute().getFirstTranslation();
		} catch(Exception ex) {
			ex.printStackTrace();
			return text;
		}
	}
}
