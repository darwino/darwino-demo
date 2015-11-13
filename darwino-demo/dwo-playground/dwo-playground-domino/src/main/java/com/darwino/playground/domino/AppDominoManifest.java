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

package com.darwino.playground.domino;

import java.util.HashMap;
import java.util.Map;

import com.darwino.domino.application.DarwinoDominoManifest;

/**
 * Domino Application Manifest.
 * 
 * @author Philippe Riand
 */
public class AppDominoManifest extends DarwinoDominoManifest {
	
	public AppDominoManifest() {
	}
	
	@Override
	public Map<String,String> getMobilePushedProperties() {
		HashMap<String, String> p = new HashMap<String, String>();
		p.put("darwino.playground.example1", "ExampleValueI");
		p.put("darwino.playground.example2", "ExampleValueII");
		return p;
	}
}
