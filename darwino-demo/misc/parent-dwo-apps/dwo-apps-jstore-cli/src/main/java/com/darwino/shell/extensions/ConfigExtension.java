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

package com.darwino.shell.extensions;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.darwino.commons.platform.beans.ManagedBeansExtension;
import com.darwino.commons.platform.beans.impl.FileXmlBeanExtension;
import com.darwino.commons.platform.properties.PropertiesExtension;
import com.darwino.commons.platform.properties.impl.FilePropertiesExtension;
import com.darwino.commons.util.StringUtil;

/**
 * Extensions.
 */
public class ConfigExtension implements ManagedBeansExtension, PropertiesExtension {
	
	public static ConfigExtension instance = new ConfigExtension();

	public static final String DEFAULT_PROPFILE = "darwino.properties";
	public static final String DEFAULT_BEANFILE = "darwino-beans.xml";

	private Set<String> directories = new HashSet<String>();
	
	private List<PropertiesExtension> propExtensions = new ArrayList<PropertiesExtension>();
	private List<ManagedBeansExtension> beanExtensions = new ArrayList<ManagedBeansExtension>();
	
	private ConfigExtension() {
	}
	
	public Set<String> getDirectories() {
		return directories;
	}
	
	public void addDirectory(String dir) {
		if(StringUtil.isNotEmpty(dir)) {
			File f = new File(dir);
			if(f.exists() && f.isDirectory()) {
				// prevent the same directory to be added multiple times 
				if(directories.contains(dir)) {
					return;
				}
				directories.add(dir);
				
				// Add the props
				File props = new File(f,DEFAULT_PROPFILE);
				if(props.exists() && props.isFile()) {
					propExtensions.add(new FilePropertiesExtension(props));
				}
				// Add the beans
				File beans = new File(f,DEFAULT_BEANFILE);
				if(beans.exists() && beans.isFile()) {
					beanExtensions.add(new FileXmlBeanExtension(beans));
				}
			}
		}
	}

	
	//
	// Properties
	//
	@Override
	public String getProperty(String name) {
		for(PropertiesExtension e: propExtensions) {
			String p = e.getProperty(name);
			if(p!=null) {
				return p;
			}
		}
		return null;
	}
	
    @Override
	public void enumerate(Set<String> keys) {
		for(PropertiesExtension e: propExtensions) {
			e.enumerate(keys);
		}
    }

    
	//
	// Managed beans
	//
	@Override
	public BeanFactory getFactory(String type, String name) {
		for(ManagedBeansExtension e: beanExtensions) {
			BeanFactory f = e.getFactory(type, name);
			if(f!=null) {
				return f;
			}
		}
		return null;
	}
	@Override
	public void enumerate(Set<String> list, String type, boolean aliases) {
		for(ManagedBeansExtension e: beanExtensions) {
			e.enumerate(list, type, aliases);
		}
	}
}