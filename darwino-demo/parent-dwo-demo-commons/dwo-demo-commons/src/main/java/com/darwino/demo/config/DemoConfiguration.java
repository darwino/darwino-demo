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

package com.darwino.demo.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class DemoConfiguration {
	private static DemoConfiguration instance;
	public static DemoConfiguration get() {
		if(instance == null) {
			instance = new DemoConfiguration();
		}
		return instance;
	}
	
	private transient Properties config_;
	
	private DemoConfiguration() {
		
	}
	
	public String getProperty(String key) {
		return getProperties().getProperty(key);
	}
	public String getProperty(String key, String defaultValue) {
		return getProperties().getProperty(key, defaultValue);
	}
	
	
	private Properties getProperties() {
		if(config_ == null) {
			// TODO have this look in other locations (service classes?)
			try {
				InputStream is = loadResource("/darwino.properties", "/darwino_default.properties");
				config_ = new Properties();
				config_.load(is);
				is.close();
			} catch(IOException ioe) {
				throw new RuntimeException("Error loading configuration", ioe);
			}
		}
		return config_;
	}
	
	public static InputStream loadResource(String resourceName, String defaultResourceName) {
		InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream(resourceName);
		if(is == null) {
			return DemoConfiguration.class.getResourceAsStream(defaultResourceName);
		}
		return is;
	}
}
