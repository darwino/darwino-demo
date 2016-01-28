/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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