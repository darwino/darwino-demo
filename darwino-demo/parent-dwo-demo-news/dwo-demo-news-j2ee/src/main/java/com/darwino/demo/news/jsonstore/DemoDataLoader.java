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

package com.darwino.demo.news.jsonstore;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.servlet.ServletContext;

import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.buffers.ByteBlockBuffer;
import com.darwino.commons.buffers.ByteBuffer;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.jsonstore.Attachment;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Store;


/**
 * Data collection object.
 */
public class DemoDataLoader {
	
	private static DemoDataLoader instance = new DemoDataLoader();
	public static DemoDataLoader get() {
		return instance;
	}
	
	private static class IconContent implements Attachment.Content {
		ByteBuffer bc = new ByteBlockBuffer();
		IconContent(ServletContext context, String name) throws IOException {
			this.bc = new ByteBlockBuffer();
			InputStream is = context.getResourceAsStream(name);
			try {
				bc.copyFrom(is);
			} finally {
				StreamUtil.close(is);
			}
		}
		@Override
		public String getMimeType() throws JsonException {
			return "image/png";
		}
		@Override
		public long getLength() throws JsonException {
			return bc.length();
		}
		@Override
		public InputStream createInputStream() throws JsonException {
			return bc.getInputStream();
		}
		@Override
		public void copyTo(OutputStream os) throws JsonException {
			try {
				bc.copyTo(os);
			} catch(IOException ex) {
				throw new JsonException(ex);
			}
		}
	}
	

	public static final String ICON_RESOURCE		= "icons.zip"; 
	
	public static final char LISTSEP	= ',';

	private List<String> categories = new ArrayList<String>();
	private List<String> sources = new ArrayList<String>();
	private List<String> icons = new ArrayList<String>();

	private NonsenseGenerator nonsense;
	private Random randomGenerator;
	
	private DemoDataLoader() {
	}
		
	private synchronized void initGenerators(ServletContext ctx) throws JsonException {
		if(randomGenerator!=null) {
			return;
		}
		
		this.randomGenerator = new Random();
		this.nonsense = new NonsenseGenerator(false);
		
		// Initialize the themes
		categories.add("Top Stories");
		categories.add("Politics");
		categories.add("Sports");
		categories.add("Technology");
		categories.add("Science");
		categories.add("Health");
		
		// Initialize the sources
		sources.add("CNN");
		sources.add("Washington Post");
		sources.add("Los Angeles Times");
		sources.add("Reuters");
		sources.add("USA Today");
		sources.add("New York Times");
		sources.add("Chicago Tribune");
		sources.add("ABC News");
		sources.add("Boston Globe");
		
		// Initialize the icons
		{
			icons = new ArrayList<String>(ctx.getResourcePaths("/WEB-INF/icons"));
		}
	}
	
	public void createDocuments(ServletContext context, Store store, int count) throws JsonException {
		for(int i=0; i<count; i++) {
			createDocument(context, store);
		}
	}

	public void createDocument(ServletContext context, Store store) throws JsonException {
		try {
			if(randomGenerator==null) {
				initGenerators(context);
			}
			// Main document
			Document doc = store.newDocument();
			doc.set("title", randomTitle());
			doc.set("content", randomContent());
			doc.set("category", randomCategory());
			doc.set("source", randomSource());
			Attachment.Content iconContent = new IconContent(context,randomIcon());
			doc.createAttachment(NewsManifest.ATTACHMENT_NAME, iconContent);
			doc.save(Document.SAVE_NOREAD);
			
			// Associated comments
			generateComments(doc);
		} catch(IOException ex) {
			throw new JsonException(ex);
		}
	}
	
	public String randomTitle() {
		return nonsense.makeHeadline();
	}

	public String randomContent() {
        StringBuilder sb = new StringBuilder();
        //sb.append("<html><body>");
        sb.append(nonsense.makeHtmlParagraphs(3, 6, 15, 25));
        //sb.append("</body></html>");
        return sb.toString();
	}

	public String randomCategory() {
		int index = randomGenerator.nextInt(categories.size());
		return categories.get(index);
	}

	public String randomSource() {
		int index = randomGenerator.nextInt(sources.size());
		return sources.get(index);
	}

	public String randomIcon() {
		int index = randomGenerator.nextInt(icons.size());
		return icons.get(index);
	}
	
	private static int[] COMMENTS_COUNT = new int [] {1,3,2,8,2,3,1};
	private static String[] AUTHORS = new String [] {
		"tommy@mymail.com",
		"pattyb@mymail.com",
		"locao@mymail.com",
		"phil17@mymail.com",
		"ronaldbarthy@mymail.com",
		"pat.fiona@mymail.com",
		"azizram@mymail.com",
		"morgan@mymail.com",
		"msmith@mymail.com",
		"dr.no@mymail.com",
		"randyyoung@mymail.com",
		"donaldduck@mymail.com",
		"pat.hibulaire@mymail.com",
		"manuelrodriguez@mymail.com",
		"frank.lebiano@mymail.com"
	};
	public void generateComments(Document parent) throws JsonException {
		int nc = COMMENTS_COUNT[randomGenerator.nextInt(COMMENTS_COUNT.length)];
		for(int i=0; i<nc; i++) {
			Document comment = parent.getDatabase().getStore(Database.STORE_COMMENTS).newDocument();
			comment.set("author", AUTHORS[randomGenerator.nextInt(AUTHORS.length)]);
			comment.set("title", nonsense.makeHeadline());
			comment.set("content", nonsense.makeComment());
			comment.setParent(parent);
			comment.save();
		}
	}
}