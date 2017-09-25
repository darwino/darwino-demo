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

package com.contacts.app;

import java.util.List;

import com.contacts.app.query.AppQueryExtension;
import com.darwino.commons.json.query.QueryExtension;
import com.darwino.commons.microservices.JsonMicroServiceFactory;
import com.darwino.commons.platform.impl.PluginImpl;
import com.darwino.commons.services.HttpServiceFactory;



/**
 * Main plugin class.
 * 
 * This class is used to register the common plugin services and is meant to be overloaded
 * by an actual implementation (J2EE, Mobile...).
 */
public abstract class AppBasePlugin extends PluginImpl {
	
	public AppBasePlugin(String name) {
		super(name);
	}
	
	@Override
	public void findExtensions(Class<?> serviceClass, List<Object> extensions) {
		if(serviceClass==HttpServiceFactory.class) {
			extensions.add(new AppRestServiceFactory());
		} else if(serviceClass==JsonMicroServiceFactory.class) {
			extensions.add(new AppMicroServicesFactory());
		} else if(serviceClass==QueryExtension.class) {
			extensions.add(new AppQueryExtension());
		}

		super.findExtensions(serviceClass, extensions);
	}
}
