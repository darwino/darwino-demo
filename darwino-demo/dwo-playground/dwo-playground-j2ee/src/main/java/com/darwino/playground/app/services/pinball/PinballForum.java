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

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.darwino.commons.json.JsonException;
import com.darwino.demodata.generators.NonsenseGenerator;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Store;



/**
 * Pinball Database.
 */
public class PinballForum {
	
	private List<String> categories = new ArrayList<String>();

	private NonsenseGenerator nonsense;
	private Random randomGenerator;

	public PinballForum() {
	}

	public void generate(Store store, int count) throws JsonException {
		initGenerators();
		createDocuments(store, count);
	}
	
	private void initGenerators() throws JsonException {
		if(randomGenerator!=null) {
			return;
		}
		
		this.randomGenerator = new Random();
		this.nonsense = new NonsenseGenerator(false);
		
		// Initialize the themes
		categories.add("Tech");
		categories.add("Restoration");
		categories.add("Playing");
		categories.add("Market");
		categories.add("Parts Manufacturer");
		categories.add("Game Manufacturer");
	}
	
	public void createDocuments(Store store, int count) throws JsonException {
		for(int i=0; i<count; i++) {
			createDocument(store);
		}
	}

	public void createDocument(Store store) throws JsonException {
		if(randomGenerator==null) {
			initGenerators();
		}
		
		// Main document
		Document doc = store.newDocument();
		doc.set("category", randomCategory());
		doc.set("title", randomTitle());
		doc.set("content", randomContent());
		
		// Associated comments
		generateComments(doc);
	}
	
	public String randomTitle() {
		return nonsense.makeHeadline();
	}

	public String randomContent() {
        StringBuilder sb = new StringBuilder();
        sb.append(nonsense.makeHtmlParagraphs(3, 6, 15, 25));
        return sb.toString();
	}

	public String randomCategory() {
		int index = randomGenerator.nextInt(categories.size());
		return categories.get(index);
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