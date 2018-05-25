/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
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

package com.contacts.app.query;

import java.util.HashMap;
import java.util.Map;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.json.query.QueryContext;
import com.darwino.commons.json.query.nodes.Node;
import com.darwino.commons.json.query.nodes.func._Function;
import com.darwino.commons.util.StringUtil;

/**
 * {$USStates: ['abr']}
 */
public class OpUSState extends _Function {

	private static Map<String,String> US_STATES = new HashMap<String, String>();
	static {
		try {
			JsonArray jst = JsonArray.fromJson("[{'label':'Alabama','value':'AL'},{'label':'Alaska','value':'AK'},{'label':'American Samoa','value':'AS'},{'label':'Arizona','value':'AZ'},{'label':'Arkansas','value':'AR'},{'label':'California','value':'CA'},{'label':'Colorado','value':'CO'},{'label':'Connecticut','value':'CT'},{'label':'Delaware','value':'DE'},{'label':'District Of Columbia','value':'DC'},{'label':'Federated States Of Micronesia','value':'FM'},{'label':'Florida','value':'FL'},{'label':'Georgia','value':'GA'},{'label':'Guam','value':'GU'},{'label':'Hawaii','value':'HI'},{'label':'Idaho','value':'ID'},{'label':'Illinois','value':'IL'},{'label':'Indiana','value':'IN'},{'label':'Iowa','value':'IA'},{'label':'Kansas','value':'KS'},{'label':'Kentucky','value':'KY'},{'label':'Louisiana','value':'LA'},{'label':'Maine','value':'ME'},{'label':'Marshall Islands','value':'MH'},{'label':'Maryland','value':'MD'},{'label':'Massachusetts','value':'MA'},{'label':'Michigan','value':'MI'},{'label':'Minnesota','value':'MN'},{'label':'Mississippi','value':'MS'},{'label':'Missouri','value':'MO'},{'label':'Montana','value':'MT'},{'label':'Nebraska','value':'NE'},{'label':'Nevada','value':'NV'},{'label':'New Hampshire','value':'NH'},{'label':'New Jersey','value':'NJ'},{'label':'New Mexico','value':'NM'},{'label':'New York','value':'NY'},{'label':'North Carolina','value':'NC'},{'label':'North Dakota','value':'ND'},{'label':'Northern Mariana Islands','value':'MP'},{'label':'Ohio','value':'OH'},{'label':'Oklahoma','value':'OK'},{'label':'Oregon','value':'OR'},{'label':'Palau','value':'PW'},{'label':'Pennsylvania','value':'PA'},{'label':'Puerto Rico','value':'PR'},{'label':'Rhode Island','value':'RI'},{'label':'South Carolina','value':'SC'},{'label':'South Dakota','value':'SD'},{'label':'Tennessee','value':'TN'},{'label':'Texas','value':'TX'},{'label':'Utah','value':'UT'},{'label':'Vermont','value':'VT'},{'label':'Virgin Islands','value':'VI'},{'label':'Virginia','value':'VA'},{'label':'Washington','value':'WA'},{'label':'West Virginia','value':'WV'},{'label':'Wisconsin','value':'WI'},{'label':'Wyoming','value':'WY'}]");
			for(int i=0; i<jst.size(); i++) {
				JsonObject st = jst.getObject(i);
				US_STATES.put(st.getString("value"), st.getString("label"));
			}
		} catch(Exception ex) {
			Platform.log(ex);
		}
	}
	
	public OpUSState(Node[] nodes) {
		super(nodes);
	}

	@Override
	public Object execute(QueryContext queryContext, Object contextValue) throws JsonException {
		String state = getStringParam(queryContext, contextValue, 0, null);
		if(StringUtil.isNotEmpty(state)) {
			String label = US_STATES.get(state);
			if(StringUtil.isNotEmpty(label)) {
				return label;
			}
		}
		return state;
	}
}
