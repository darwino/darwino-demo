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

package com.darwino.demo.news.beans;

import java.io.InputStream;
import java.io.Serializable;

import javax.faces.context.FacesContext;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import com.darwino.application.jsonstore.NewsDatabaseDef;
import com.darwino.commons.Platform;
import com.darwino.commons.httpclnt.HttpBase;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.util.CallbackImpl;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.commons.util.io.content.ByteBufferContent;
import com.darwino.demo.news.jsonstore.DemoDataLoader;
import com.darwino.demo.otherdb.PinballDatabaseDef;
import com.darwino.demodata.json.JsonDatabaseGenerator;
import com.darwino.demodata.json.JsonDatabaseGenerator.JsonContent;
import com.darwino.demodata.json.pinball.PinballDatabase;
import com.darwino.demodata.json.pinball.PinballOwnerDatabase;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.Store;


/**
 * Bean associated to the main page.
 * 
 * @author Philippe Riand
 */
//@SuppressWarnings("serial")
//@ManagedBean(name="adminBean")
//@RequestScoped
public class AdminBean implements Serializable {
	private static final long serialVersionUID = 1L;
	
	public AdminBean() {
	}
    
    public void recreateDatabase() {
    	try {
        	DarwinoJ2EEApplication.get().initDatabase(NewsDatabaseDef.DATABASE_NEWS, true);
		} catch (JsonException e) {
			Platform.log(e);
		}
	}
    
    public void deleteAllDocuments() {
    	try {
        	Session jsonSession = DatabaseSession.get();
			jsonSession.getDatabase(NewsDatabaseDef.DATABASE_NEWS).deleteAllDocuments(Store.DELETE_ERASE);
		} catch (JsonException e) {
			Platform.log(e);
		}
	}

    public void createDocuments5() {
    	createDocuments(5);
	}

    public void createDocuments25() {
    	createDocuments(25);
	}

    public void createDocuments100() {
    	createDocuments(100);
	}

    public void createDocuments1000() {
    	createDocuments(1000);
	}

    public void createDocuments10000() {
    	createDocuments(10000);
	}

    public void createDocuments(int count) {
    	try {
        	Session jsonSession = DatabaseSession.get();
        	ServletContext ctx = ((HttpServletRequest)FacesContext.getCurrentInstance().getExternalContext().getRequest()).getServletContext();
			DemoDataLoader.get().createDocuments(ctx,jsonSession.getDatabase(NewsDatabaseDef.DATABASE_NEWS).getStore(NewsDatabaseDef.STORE_NEWS),count);
		} catch (JsonException e) {
			Platform.log(e);
		}
	}
    

    public void recreatePinballDatabase() {
    	try {
    		// Create the database
        	DarwinoJ2EEApplication.get().initDatabase(PinballDatabaseDef.DATABASE_PINBALL, true, new PinballDatabaseDef());
        	
        	// And fill the documents
        	final Session jsonSession = DatabaseSession.get();
        	PinballDatabase pd = new PinballDatabase();
        	pd.generate(new CallbackImpl<JsonDatabaseGenerator.JsonContent>() {
        		Store store = jsonSession.getDatabase(PinballDatabaseDef.DATABASE_PINBALL).getStore(PinballDatabaseDef.STORE_PINBALLS);
				@Override
				public void success(JsonContent value) {
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
				}
			});
        	
        	fillPinballOwners(jsonSession.getDatabase(PinballDatabaseDef.DATABASE_PINBALL).getStore(PinballDatabaseDef.STORE_PINBALLOWNER), 45, 4);
        	fillPinballOwners(jsonSession.getDatabase(PinballDatabaseDef.DATABASE_PINBALL).getStore(PinballDatabaseDef.STORE_PINBALLOWNERB), 10000, 16);
        	fillPinballOwners(jsonSession.getDatabase(PinballDatabaseDef.DATABASE_PINBALL).getStore(PinballDatabaseDef.STORE_PINBALLOWNERBG), 100000, 16);
		} catch (JsonException e) {
			Platform.log(e);
		}
	}
    private void fillPinballOwners(final Store store, int nOwners, int maxPinball) {
    	PinballOwnerDatabase pod = new PinballOwnerDatabase();
    	pod.generate(new CallbackImpl<JsonDatabaseGenerator.JsonContent>() {
    		long start = System.currentTimeMillis();
    		int count;
			@Override
			public void success(JsonContent value) {
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
			}
		},nOwners,maxPinball);
    }
}
