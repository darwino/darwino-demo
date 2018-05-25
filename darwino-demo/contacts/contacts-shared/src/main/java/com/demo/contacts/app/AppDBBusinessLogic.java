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

package com.demo.contacts.app;

import com.darwino.jsonstore.extensions.DefaultExtensionRegistry;
import com.darwino.jsonstore.impl.DarwinoInfCursorFactory;
import com.darwino.jsonstore.local.DefaultDatabaseACLFactory;

/**
 * Database Business logic - event handlers.
 * 
 * @author Philippe Riand
 */
public class AppDBBusinessLogic extends DefaultExtensionRegistry {
	
	@SuppressWarnings("unused")
	public AppDBBusinessLogic() {
		// Add here the database events to register to the JSON store
//		registerDocumentEvents("<My Database Id>", "<My Store Id>", new DocumentEvents() {
//			@Override
//			public void querySaveDocument(Document doc) throws JsonException {
//			}
//		});

		// Use a query factory
		setQueryFactory(new DarwinoInfCursorFactory(getClass()));
		
		// Default database ACL factory read the design element coming from Domino
		if(false) {
			setDatabaseACLFactory(new DefaultDatabaseACLFactory());
		}
	}
}
