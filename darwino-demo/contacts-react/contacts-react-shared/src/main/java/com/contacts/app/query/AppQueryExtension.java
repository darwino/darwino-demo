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

import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.query.QueryExtension;
import com.darwino.commons.json.query.nodes.Node;
import com.darwino.commons.json.query.parser.BaseParser;
import com.darwino.commons.json.query.parser.BaseParser.NodeOperator;



/**
 * Application query extension factory.
 */
public class AppQueryExtension implements QueryExtension {

	private static HashMap<String,NodeOperator> opList = new HashMap<String, BaseParser.NodeOperator>();
	static {
		for(Op op : Op.values()) {
			opList.put(op.getValue(), new DefaultNodeOperator(op));
		}
	}
	
	public static enum Op {
		USSTATE("$USState"), //$NON-NLS-1$
		;
		private final String value;
		
		private Op(String value) {
			this.value = value;
		}
		
		public String getValue() {
			return value;
		}
	}
	
	public static final class DefaultNodeOperator implements NodeOperator {
		
		private Op op;
		
		public DefaultNodeOperator(Op op) {
			this.op = op;
		}
		
		@Override
		public Node findOperator(BaseParser _parser, Object map, String key, Object value) throws JsonException {
			switch(op) {
				case USSTATE: { 
					Node[] params = _parser.createFonctionParameters(value);
					return new OpUSState(params);
				}
			}
			throw new IllegalStateException();
		}
	}
	
	@Override
	public NodeOperator findOperator(BaseParser parser, String op) throws JsonException {
		return opList.get(op);
	}
}
