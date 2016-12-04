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