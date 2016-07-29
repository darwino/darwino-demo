/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

package com.darwino.demo.dominodisc.demodata;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.darwino.commons.Platform;
import com.darwino.commons.httpclnt.HttpBinaryData;
import com.darwino.commons.httpclnt.HttpClient;
import com.darwino.commons.httpclnt.HttpClientService;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.json.nav.JsonNav;
import com.darwino.commons.json.nav.JsonNav.Handler;
import com.darwino.commons.util.DateTimeISO8601;
import com.darwino.commons.util.StringArray;
import com.darwino.commons.util.text.HtmlTextUtil;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.sql.impl.full.DocumentImpl;


/**
 * Read data from an existing internet forum.
 * Uses discourse forum: https://github.com/discourse/discourse
 */
public class ForumDataReader {

	public static final String JSON_FORUM = "http://discuss.jsonapi.org/";
	public static final String PINBALL_FORUM = "http://tiltforums.com/";
			
	private String url;
	
	public ForumDataReader(String url) {
		this.url = url;
	}
	
	public void extract(final Store store, final int MAX_ITEMS) throws JsonException {
		final HttpClient httpClient = Platform.getService(HttpClientService.class).createHttpClient(url);

		store.deleteAllDocuments(Store.DELETE_ERASE);
		
		// http://discuss.jsonapi.org/latest.json?[page=xx]
		final int[] count = new int[1];
		int last = -1;
		for(int i=0; count[0]<MAX_ITEMS; i++) {
			// Check for EOF
			if(last==count[0]) {
				break;
			}
			last = count[0];
			
			Map<String,Object> params = null;
			if(i>0) {
				params = Collections.singletonMap("page", (Object)Integer.valueOf(i));
			}
			JsonObject o = (JsonObject)httpClient.getAsJson(new String[]{"latest.json"},params);

			JsonNav n = JsonNav.create(o);
			n.get("topic_list").get("topics").flatten().forEach(new Handler() {
				@Override
				public void handle(JsonNav nav) throws JsonException {
					if(count[0]++>=MAX_ITEMS) {
						return;
					}
					
					store.getSession().startTransaction();
					try {
						final String threadTitle = nav.get("title").stringValue();
						final String threadId = Integer.toString(nav.get("id").intValue());
						
						// When we read a page, some item might have been pushed down to the next page as well
						// -> we avoid duplicate here!
						if(store.documentExists(threadId)) {
							return;
						}
	
						JsonObject thread = (JsonObject)httpClient.getAsJson(new String[]{"t",threadId+".json"});
						
						final String[] mainId = new String[1];
						JsonNav tn = JsonNav.create(thread);
						tn.get("post_stream").get("posts").flatten().forEach(new Handler() {
							@Override
							public void handle(JsonNav nav) throws JsonException {
								/*String unid;*/ String punid; String title; 
								// Check for the first item
								if(mainId[0]==null) {
									punid = null;
									title = threadTitle;
									Platform.log("Creating main forum doc id:{0}",threadId);
								} else {
									punid = mainId[0];
									title = HtmlTextUtil.fromHTML(nav.get("cooked").stringValue(),30);
								}
	
								Map<String,String> att = new HashMap<String,String>();
								
								String username = processUsername(nav.get("username").stringValue());
								Date created = DateTimeISO8601.asISO8601Date(nav.get("created_at").stringValue());
								Date updated = DateTimeISO8601.asISO8601Date(nav.get("updated_at").stringValue());
								String body = processBody(nav.get("cooked").stringValue(),att);
	
								DocumentImpl doc = (DocumentImpl)store.newDocument();
								if(mainId[0]==null) {
									mainId[0] = doc.getUnid();
								}
								
								doc.setParentUnid(punid);
								addDates(doc, created, updated, username);
								addReadersWriters(doc, username);
								addContent(doc, title, body);
								addAttachments(doc, att);
								
								beforeSavingDocument(doc);
								doc.save(Document.SAVE_FORCEMETA);
							}
						});
						store.getSession().commitTransaction();
					} finally {
						store.getSession().endTransaction();
					}
				}
			});
		}
	}
	
	protected void addDates(Document doc, Date created, Date updated, String username) throws JsonException {
		JsonObject jo = (JsonObject)doc.getJson();
		JsonObject meta = jo.getOrCreateObject(Document.SYSTEM_META_FIELD);
		meta.put(Document.SYSTEM_META_CDATE, DateTimeISO8601.formatISO8601(created.getTime()));
		meta.put(Document.SYSTEM_META_CUSER, username);
		meta.put(Document.SYSTEM_META_MDATE, DateTimeISO8601.formatISO8601(updated.getTime()));
		meta.put(Document.SYSTEM_META_MUSER, username);
	}

	protected void addReadersWriters(Document doc, String username) throws JsonException {
		JsonObject jo = (JsonObject)doc.getJson();
		jo.getOrCreateObject("_readers").getOrCreateArray("_allReaders").add("*");
		jo.getOrCreateObject("_writers").getOrCreateArray("from").add(username);
	}

	protected void addContent(Document doc, String title, String body) throws JsonException {
		JsonObject jo = (JsonObject)doc.getJson();
		jo.put("subject", title);
		jo.put("body", body);
	}

	protected void addAttachments(Document doc, Map<String,String> att) throws JsonException {
		for(Map.Entry<String, String> e: att.entrySet()) {
			String name = e.getKey();
			String url = "http:"+e.getValue();
			
			HttpClient httpClient = Platform.getService(HttpClientService.class).createHttpClient(url);
			
			HttpBinaryData b=httpClient.getAsBinaryData(StringArray.EMPTY_ARRAY);

			doc.createAttachment(name, b.getContent());
			
// Instead we can use this			
// The code here is not as optimized as it uses a temporary buffer, but doesn't leave http connections opened...			
//			try {
//				doc.createAttachment(name, new HttpBinaryDataContent(b));
//			} catch(IOException ex) {
//				throw new JsonDBException(ex);
//			}
		}
	}

	protected void beforeSavingDocument(Document doc) {
	}

	
	protected String processBody(String htmlBody, Map<String,String> att) {
		// Extract all the images
		// Example:
		//	<p>New custom drinking trophies for this weekend's tournament in Lafayette, IN. Come on over and play. 
		//	<div class=\"lightbox-wrapper\">
		//	   <a data-download-href=\"//tiltforums.com/uploads/default/2260454d1e87e9cab194b8d49e6e7c8045605064\" href=\"//tiltforums.com/uploads/default/original/1X/2260454d1e87e9cab194b8d49e6e7c8045605064.jpg\" class=\"lightbox\" title=\"image.jpg\">
		//	      <img src=\"//tiltforums.com/uploads/default/optimized/1X/2260454d1e87e9cab194b8d49e6e7c8045605064_1_666x500.jpg\" width=\"666\" height=\"500\">
		//	      <div class=\"meta\">\n<span class=\"filename\">image.jpg</span><span class=\"informations\">3264x2448 1.56 MB</span><span class=\"expand\"></span>\n</div>
		//	   </a>
		//	</div>
		//	</p>	
		int pos; int nimage=0;
		while((pos=htmlBody.indexOf("<div class=\"lightbox-wrapper\">"))>=0) {
			int d1 = htmlBody.indexOf("</div>",pos);
			if(d1<0) break;
			int d2 = htmlBody.indexOf("</div>",d1+6);
			if(d2<0) break;
			
			int urlstart=htmlBody.indexOf(" href=",pos);
			if(urlstart>0) {
				int start = htmlBody.indexOf('\"',urlstart);
				int end = htmlBody.indexOf('\"',start+1);
				String url= htmlBody.substring(start+1,end);
				String attname = "Body||img"+(nimage++)+getFileExtension(url);
				String dwourl = "<p><img src=\"$document-attachment/"+attname+"\"></p>";
				htmlBody = htmlBody.substring(0,pos)+dwourl+htmlBody.substring(d2+6);
				
				att.put(attname, url);
			}
		}

		return htmlBody;
	}
	private String getFileExtension(String s) {
		int pos = s.lastIndexOf('.');
		if(pos>=0) {
			return s.substring(pos);
		}
		return "";
	}

	private Map<String,String> userNames = new HashMap<String, String>();
	private String processUsername(String userName) {
		if(!userNames.containsKey(userName)) {
			String cvtName=null;
			switch(userNames.size() % 15) {
				case 0:		cvtName="cn=adam tinov,o=triloggroup"; break;
				case 1:		cvtName="cn=al mass,o=triloggroup"; break;
				case 2:		cvtName="cn=alain boucher,o=triloggroup"; break;
				case 3:		cvtName="cn=amanda calder,o=triloggroup"; break;
				case 4:		cvtName="cn=ava gardner,o=triloggroup"; break;
				case 5:		cvtName="cn=bernard chapot,o=triloggroup"; break;
				case 6:		cvtName="cn=bernard lemercier,o=triloggroup"; break;
				case 7:		cvtName="cn=betty chris,o=triloggroup"; break;
				case 8:		cvtName="cn=bill bright,o=triloggroup"; break;
				case 9:		cvtName="cn=lauren armatti,o=triloggroup"; break;
				case 10:	cvtName="cn=leon bros,o=triloggroup"; break;
				case 11:	cvtName="cn=mary davis,o=triloggroup"; break;
				case 12:	cvtName="cn=philip collins,o=triloggroup"; break;
				case 13:	cvtName="cn=ralf jordan,o=triloggroup"; break;
				case 14:	cvtName="cn=lauren armatti,o=triloggroup"; break;
			}
			userNames.put(userName, cvtName);
		}
		return userNames.get(userName);
	}
}
