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

package com.darwinodb.app.platform;

import java.io.File;

import com.darwino.commons.platform.beans.impl.AbstractXmlBeanExtension;
import com.darwinodb.app.Main;



/**
 * Managed Bean extension for a default server installation.
 * 
 * @author Philippe Riand
 */
public class WebBeanExtension extends AbstractXmlBeanExtension {

	public WebBeanExtension() {
	}

	@Override
	protected boolean initFactories() {
		// Only from the Darwino-DB directpry for now
		initDarwinoDBDir();
		return true;
	}
	
	protected void initDarwinoDBDir() {
		addFactoriesFromFile(getFile());
	}
	
	public static File getFile() {
		return new File(Main.get().getConfigDir(),"darwino-beans.xml");
	}
}