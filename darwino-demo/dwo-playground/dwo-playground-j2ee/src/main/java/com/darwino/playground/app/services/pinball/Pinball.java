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

import java.io.IOException;

import com.darwino.commons.Platform;
import com.darwino.demodata.DemoDataLoader;



/**
 * Data collection of Pinbal.
 */
public class Pinball extends DemoDataLoader {

	public static final String RESOURCE_NAME = "pinball/pinball.csv"; 
			
	public Pinball() {
		super(new String[]{"name","brand","link","link-href","description","manufacturer","date","type","released","value","cabinet","display","image-src","players","flippers","ramps","multiball","ipdb"});
		try {
			readFromClassResource(RESOURCE_NAME, new Options() {
				@Override
				public boolean ignoreFirstRow() {
					return true;
				}
				@Override
				public String transform(int column, String s) {
					return s;
				}
			});
		} catch(IOException ex) {
			Platform.log(ex);
		}
	}
}