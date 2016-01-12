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
import java.util.List;

import com.darwino.commons.json.JsonObject;
import com.darwino.commons.util.Callback;
import com.darwino.commons.util.StringUtil;
import com.darwino.demodata.json.JsonDatabaseGenerator;



/**
 * Pinball Database.
 */
public class PinballDatabase extends JsonDatabaseGenerator {
	
	protected Pinball pinball = new Pinball();

	public PinballDatabase() {
	}

	public void generate(Callback<JsonContent> cb) {
		String[] columns = pinball.getColumns();
		List<String[]> pinball2 = pinball.getList();
		for(int i=0; i<pinball2.size(); i++) {
			JsonObject o = new JsonObject();
			for(int j=0; j<columns.length; j++) {
				String column = columns[j];
				String value = pinball.getValue(i, j);
				// Handle the invalid values in the file
				if(StringUtil.isEmpty(value) || value.equals("null") || value.equals("?")) { 
					continue;
				}
				if(StringUtil.equals(column, "released")) {
					String r = value.replace(",","");
					o.putDouble(column, Double.parseDouble(r));
				} else if(StringUtil.equals(column, "flippers")) {
					o.putInt(column, Integer.parseInt(value));
				} else if(StringUtil.equals(column, "ramps")) {
					o.putInt(column, Integer.parseInt(value));
				} else if(StringUtil.equals(column, "players")) {
					o.putInt(column, Integer.parseInt(value));
				} else if(StringUtil.equals(column, "image-src")) {
					String img = value.substring(value.lastIndexOf('/')+1);
					o.putString(column, img);
				} else {
					o.putString(column, value);
				}
			}
			cb.success(new BaseJsonContent(o) {
				@Override
				public InputStream createInputStream(String binaryName) {
					String fullPath = "/resources/pinball/"+binaryName;
					return getClass().getResourceAsStream(fullPath);
				}
			});
		}
	}

	public static void main(String[] args) {
		PinballDatabase gen = new PinballDatabase();
		gen.generate(new Console());
	}
}