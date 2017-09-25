/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
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
