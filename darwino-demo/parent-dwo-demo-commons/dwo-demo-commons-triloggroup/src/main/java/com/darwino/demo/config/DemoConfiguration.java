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
