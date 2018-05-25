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

package com.darwino.shell;

import java.util.List;

import com.darwino.commons.platform.beans.ManagedBeansExtension;
import com.darwino.commons.platform.impl.PluginImpl;
import com.darwino.commons.platform.properties.PropertiesExtension;
import com.darwino.commons.security.acl.UserService;
import com.darwino.shell.extensions.ConfigExtension;



/**
 * Plug-in.
 */
public class PluginShell extends PluginImpl {
	
	public PluginShell() {
		super("JSON store shell");
	}

	@Override
	public Object findDefaultService(Class<?> serviceClass) {
		// Unless a user service is explicitly set, we use a bean based one
		if(serviceClass==UserService.class) {
			return findServiceAsBean(UserService.BEAN_TYPE);
		}
		return null;
	}
	
	@Override
	public void findExtensions(Class<?> serviceClass, List<Object> extensions) {
		if(serviceClass==ManagedBeansExtension.class) {
			extensions.add(ConfigExtension.instance);
		} else if(serviceClass==PropertiesExtension.class) {
			extensions.add(ConfigExtension.instance);
		}
	}
}
