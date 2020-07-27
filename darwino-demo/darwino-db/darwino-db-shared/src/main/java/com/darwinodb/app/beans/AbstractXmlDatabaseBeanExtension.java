/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

package com.darwinodb.app.beans;

import org.w3c.dom.Element;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.platform.beans.impl.AbstractXmlBeanExtension;
import com.darwino.commons.xml.DomUtil;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.DocumentCollection;
import com.darwino.jsonstore.callback.DocumentHandler;


/**
 * Database Managed Bean Factory.
 *
 * The beans are created out of database documents.
 * We use the XML formalism as this is simpler and guarantees the same behaviors.
 *  
 * @author Philippe Riand
 */
public abstract class AbstractXmlDatabaseBeanExtension extends AbstractXmlBeanExtension {

	public AbstractXmlDatabaseBeanExtension() {
	}
	
	@Override
	protected boolean initFactories() {
//		org.w3c.dom.Document xml = createBeanDocument();
//		if(xml!=null) {
//			addFactories(xml);
//		}
		return true;
	}	
	
	private org.w3c.dom.Document createBeanDocument() throws JsonException {		
		DocumentCollection col = readDocuments();
		if(col!=null) {
			org.w3c.dom.Document xml = DomUtil.createDocument();
			Element beans = DomUtil.createRootElement(xml, "beans");

			col.findDocuments(new DocumentHandler() {
				@Override
				public boolean handle(Document document) throws JsonException {
					createBeanElement(beans, document);
					return false;
				}
			});
			return xml;
		}
		return null;
	}
	

	
	//
	// Read the collection of documents
	//
	
	protected abstract DocumentCollection readDocuments();	

	protected abstract void createBeanElement(Element parent, Document doc);

}
