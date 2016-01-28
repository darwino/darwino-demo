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

import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.util.Callback;
import com.darwino.commons.util.StringUtil;
import com.darwino.demodata.FirstNames_Female;
import com.darwino.demodata.FirstNames_Male;
import com.darwino.demodata.LastNames;
import com.darwino.demodata.Sex;
import com.darwino.demodata.USCities;
import com.darwino.demodata.json.JsonDatabaseGenerator;



/**
 * Pinball Owner Database.
 */
public class PinballOwnerDatabase extends JsonDatabaseGenerator {
	
	protected Sex sex = new Sex();
	protected FirstNames_Male fNameMales = new FirstNames_Male();
	protected FirstNames_Female fNameFemales = new FirstNames_Female();
	protected LastNames lName = new LastNames();
	protected USCities cities = new USCities();

	protected Pinball pinball = new Pinball();
	
	public PinballOwnerDatabase() {
	}

	public void generate(Callback<JsonContent> cb, int nOwners, int maxPinball) {
		for(int i=0; i<nOwners; i++) {
			JsonObject owner = new JsonObject();
	
			// Identification
			String sexe = sex.randomValue();
			owner.putString("sexe",sexe);
			if(StringUtil.equals(sexe, "M")) {
				owner.putString("firstName",fNameMales.randomValue());
			} else {
				owner.putString("firstName",fNameFemales.randomValue());
			}
			owner.putString("lastName", lName.randomValue());
			
			owner.putString("email", owner.getString("firstName").substring(0,1).toLowerCase() + owner.getString("lastName").toLowerCase()+"@dwopinball.demo");
			
			// City and state
			String[] c = (String[])cities.randomValues();
			owner.putString("city", c[0] );
			owner.putString("state", c[1] );
			
			JsonArray pins = new JsonArray();
			int np = (int)(Math.random()*maxPinball)+1; // Make sure at least 1!
			for(int j=0; j<np; j++) {
				String[] pin = pinball.randomValues();
				JsonObject jp = new JsonObject();
				jp.putString("manufacturer", pinball.getValue(pin, "manufacturer"));
				jp.putString("ipdb", pinball.getValue(pin, "ipdb"));
				jp.putString("name", pinball.getValue(pin, "name"));
				pins.add(jp);
			}
			owner.putArray("pinballs", pins);
			
			cb.success(new BaseJsonContent(owner));
		}
	}	
}