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

import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonException;
import com.darwino.demodata.generators.NonsenseGenerator;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Store;



/**
 * Pinball Database.
 */
public class PinballForum {
	
	private List<String> authors = new ArrayList<String>();
	private List<String> categories = new ArrayList<String>();
	private List<String> tags = new ArrayList<String>();

	private NonsenseGenerator nonsense;
	private Random randomGenerator;

	public PinballForum() {
	}

	public void generate(Store store, int count) throws JsonException {
		initGenerators();
		createDocuments(store, count);
	}
	
	private void initGenerators() throws JsonException {
		this.randomGenerator = new Random();
		this.nonsense = new NonsenseGenerator(false);
		
		// Initialize the authors
		authors.add("tommy@mymail.com");
		authors.add("pattyb@mymail.com");
		authors.add("locao@mymail.com");
		authors.add("phil17@mymail.com");
		authors.add("ronaldbarthy@mymail.com");
		authors.add("pat.fiona@mymail.com");
		authors.add("azizram@mymail.com");
		authors.add("morgan@mymail.com");
		authors.add("msmith@mymail.com");
		authors.add("dr.no@mymail.com");
		authors.add("randyyoung@mymail.com");
		authors.add("donaldduck@mymail.com");
		authors.add("pat.hibulaire@mymail.com");
		authors.add("manuelrodriguez@mymail.com");
		authors.add("frank.lebiano@mymail.com");
		
		// Initialize the categories
		categories.add("Tech");
		categories.add("Restoration");
		categories.add("Playing");
		categories.add("Market");
		categories.add("Parts Manufacturer");
		categories.add("Game Manufacturer");
		
		// Initialize the tags
		tags.add("ElectroMechanical");
		tags.add("Electronic");
		tags.add("Flipper");
		tags.add("Glass");
		tags.add("Display");
		tags.add("Bumper");
		tags.add("Ramp");
		tags.add("Ball");
	}
	
	public void createDocuments(Store store, int count) throws JsonException {
		for(int i=0; i<count; i++) {
			int lvl = randomGenerator.nextInt(3)+1;
			generateDocuments(store, null, lvl);
		}
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
	
	private static int[] RESPONSES_COUNT = new int [] {1,3,2,1,2,3,1};
	public void generateDocuments(Store store, Document parent, int level) throws JsonException {
		Document doc = store.newDocument();
		doc.set("author", authors.get(randomGenerator.nextInt(authors.size())));
		doc.set("category", categories.get(randomGenerator.nextInt(categories.size())));
		JsonArray tags = getTags();
		if(tags!=null) {
			doc.set(Document.SYSTEM_TAGS, tags);
		}
		doc.set("title", nonsense.makeHeadline());
		doc.set("content", nonsense.makeComment());
		doc.setParent(parent);
		doc.save();
		
		if(level>0) {
			int nc = RESPONSES_COUNT[randomGenerator.nextInt(RESPONSES_COUNT.length)];
			for(int i=0; i<nc; i++) {
				generateDocuments(store, doc, level-1);
			}
		}
	}
	private JsonArray getTags() {
		int n = randomGenerator.nextInt(4);
		if(n>0) {
			JsonArray a = new JsonArray();
			for(int i=0; i<n; i++) {
				while(true) {
					String tag = tags.get(randomGenerator.nextInt(tags.size()));
					if(!a.contains(tag)) {
						a.add(tag);
						break;
					}
				}
			}
			return a;
		}
		return null;
	}
}