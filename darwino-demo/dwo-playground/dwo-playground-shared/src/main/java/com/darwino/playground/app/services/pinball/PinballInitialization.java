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

package com.darwino.playground.app.services.pinball;

import java.io.InputStream;

import com.darwino.commons.Platform;
import com.darwino.commons.httpclnt.HttpBase;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.util.CallbackImpl;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.commons.util.io.content.ByteBufferContent;
import com.darwino.demodata.json.JsonDatabaseGenerator;
import com.darwino.demodata.json.JsonDatabaseGenerator.JsonContent;
import com.darwino.jre.application.DarwinoJreApplication;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.Store;
import com.darwino.playground.app.AppDatabaseDef;


/**
 * Pinbal Initialization.
 * 
 * @author Philippe Riand
 */
public class PinballInitialization {

	public PinballInitialization() {
	}
	
	public JsonObject init(final Session jsonSession) throws JsonException {
		recreatePinballDatabase(jsonSession);

		JsonObject o = new JsonObject();
		Database db =jsonSession.getDatabase(AppDatabaseDef.DATABASE_NAME);
		o.put("result", "Pinball Database Reset");
		o.put("pinballCount", db.getStore(AppDatabaseDef.STORE_PINBALLS).documentCount());
		o.put("forumCount", db.getStore(AppDatabaseDef.STORE_FORUM).documentCount());
		o.put("ownersCount", db.getStore(AppDatabaseDef.STORE_PINBALLOWNER).documentCount());
		o.put("ownersBCount", db.getStore(AppDatabaseDef.STORE_PINBALLOWNERB).documentCount());
		o.put("ownersBGCount", db.getStore(AppDatabaseDef.STORE_PINBALLOWNERBG).documentCount());
		return o;
	}
	
    public void recreatePinballDatabase(final Session jsonSession) throws JsonException {
		// Create the database
    	DarwinoJreApplication.get().initDatabase(AppDatabaseDef.DATABASE_NAME, true, new AppDatabaseDef(), null);
    	
    	// And fill the documents
    	fillPinball(jsonSession.getDatabase(AppDatabaseDef.DATABASE_NAME).getStore(AppDatabaseDef.STORE_PINBALLS));
    	fillPinballForums(jsonSession.getDatabase(AppDatabaseDef.DATABASE_NAME).getStore(AppDatabaseDef.STORE_FORUM));

    	fillPinballOwners(jsonSession.getDatabase(AppDatabaseDef.DATABASE_NAME).getStore(AppDatabaseDef.STORE_PINBALLOWNER), 45, 4);
    	fillPinballOwners(jsonSession.getDatabase(AppDatabaseDef.DATABASE_NAME).getStore(AppDatabaseDef.STORE_PINBALLOWNERB), 100, 4);
    	fillPinballOwners(jsonSession.getDatabase(AppDatabaseDef.DATABASE_NAME).getStore(AppDatabaseDef.STORE_PINBALLOWNERBG), 500, 4);
    	//fillPinballOwners(jsonSession.getDatabase(AppDatabaseDef.DATABASE_NAME).getStore(AppDatabaseDef.STORE_PINBALLOWNERB), 10000, 16);
    	//fillPinballOwners(jsonSession.getDatabase(AppDatabaseDef.DATABASE_NAME).getStore(AppDatabaseDef.STORE_PINBALLOWNERBG), 100000, 16);
	}
    
    private void fillPinball(final Store store) throws JsonException {
    	PinballDatabase pd = new PinballDatabase();
    	pd.generate(new CallbackImpl<JsonDatabaseGenerator.JsonContent>() {
			@Override
			public Object success(JsonContent value) {
				try {
					JsonObject o = value.getJsonObject();
					String ipdb = o.getString("ipdb");
					if(StringUtil.isNotEmpty(ipdb)) {
						Document doc = store.newDocument(ipdb);
						String img = o.getString("image-src");
						if(img!=null) {
							InputStream is = value.createInputStream(img);
							if(is!=null) {
								try {
									ByteBufferContent bf = new ByteBufferContent(is,HttpBase.MIME_IMAGE_PNG);
									doc.createAttachment("picture.png", bf);
								} finally {
									StreamUtil.close(is);
								}
							}
							o.remove("image-src");
						}
						doc.setJson(o);
						doc.save(Document.SAVE_NOREAD);
					}
				} catch(Exception ex) {
					Platform.log(ex);
				}
				return null;
			}
		});
    }
    
    private void fillPinballForums(final Store store) throws JsonException {
    	PinballForum pfo = new PinballForum();
    	pfo.generate(store, 20);
    }
    
    private void fillPinballOwners(final Store store, int nOwners, int maxPinball) {
    	PinballOwnerDatabase pod = new PinballOwnerDatabase();
    	pod.generate(new CallbackImpl<JsonDatabaseGenerator.JsonContent>() {
    		long start = System.currentTimeMillis();
    		int count;
			@Override
			public Object success(JsonContent value) {
				try {
					JsonObject o = value.getJsonObject();
					Document doc = store.newDocument();
					doc.setJson(o);
					doc.save(Document.SAVE_NOREAD);
					count++;
					if((count %100)==0) {
			    		long now = System.currentTimeMillis();
			    		int sec = (int)((now-start)/1000L);
						System.out.println("Entries loaded: "+count+", "+(count/(sec>0?sec:1))+"doc/sec");
					}
				} catch(JsonException ex) {
					Platform.log(ex);
				}
				return null;
			}
		},nOwners,maxPinball);
    }
	
}
