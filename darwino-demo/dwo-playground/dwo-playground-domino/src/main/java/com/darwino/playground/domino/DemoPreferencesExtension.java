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

package com.darwino.playground.domino;

import java.util.HashMap;
import java.util.Map;

import com.darwino.commons.preferences.PreferencesException;
import com.darwino.commons.preferences.impl.PreferencesExtension;
import com.darwino.commons.preferences.impl.PreferencesImpl;
import com.darwino.commons.util.StringUtil;

/**
 * Demo Preferences extension.
 */
public class DemoPreferencesExtension implements PreferencesExtension {

	public static final int MAX_USERS	= 16;		
	public static final int MAX_PREFS	= 4;		
	public static final int MAX_ENTRIES	= 8;		
	
	protected class MemoryPreferences extends PreferencesImpl {
		
		public MemoryPreferences(String user, String prefs, Map<String,Object> values) {
			super(user,prefs,values);
		}

		@Override
		protected void syncPrefs() throws PreferencesException {
			setValues(getMap(getUser(),getPrefs()));
			setChanges(null);
		}

		@Override
		protected void savePrefs() throws PreferencesException {
			savePreferences(this);
		}
	}
	
	private Map<String,Map<String,Map<String,Object>>> allPreferences; 

	public DemoPreferencesExtension() {
		reset(); 
	}
	
	public void reset() {
		this.allPreferences = new HashMap<String, Map<String,Map<String,Object>>>(); 
	}

	protected boolean supportPrefs(String prefs) {
		return true;
	}
	protected void addDefaultPrefs(Map<String,Object> map, String user, String prefs) {
		map.put("pref1", "value1");
		map.put("pref2", "value2");
	}
	
	private synchronized Map<String,Object> getMap(String user, String prefs) {
		// These preferences must be supported...
		if(!supportPrefs(prefs)) {
			return null;
		}
		
		Map<String,Map<String,Object>> userMap = allPreferences.get(user);
		if(userMap==null) {
			userMap = new HashMap<String,Map<String,Object>>();
			allPreferences.put(user, userMap);
		}
		Map<String,Object> prefsMap = userMap.get(prefs);
		if(prefsMap==null) {
			prefsMap = new HashMap<String,Object>();
			// Add default values
			addDefaultPrefs(prefsMap,user,prefs);
			userMap.put(prefs, prefsMap);
		}
		return prefsMap;
	}
	
	@Override
	public PreferencesImpl getPreferences(String user, String prefs) throws PreferencesException {
		Map<String,Object> map = getMap(user,prefs);
		if(map!=null) {
			Map<String,Object> copy = new HashMap<String,Object>(map);
			return new MemoryPreferences(user,prefs,copy);
		}
		return null;
	}

	@Override
	public synchronized boolean deletePreferences(String user, String prefs) throws PreferencesException {
		// These preferences must be supported...
		if(!supportPrefs(prefs)) {
			return false;
		}
		
		if(StringUtil.isEmpty(prefs)) {
			allPreferences.remove(user);
		} else {
			Map<String,Map<String,Object>> userMap = allPreferences.get(user);
			userMap.remove(prefs);
		}
		
		// Whenever it is deleted or not, it is handled
		return true;
	}

	protected synchronized void savePreferences(PreferencesImpl preferences) throws PreferencesException {
		Map<String,Object> changes = preferences.getChanges();
		if(changes!=null && !changes.isEmpty()) {
			Map<String,Object> map = getMap(preferences.getUser(),preferences.getPrefs());
			for(Map.Entry<String, Object> e: changes.entrySet()) {
				String k = e.getKey();
				Object v = e.getValue();
				if(v!=null) {
					map.put(k, v);
				} else {
					map.remove(k);
				}
			}
			changes = null;
		}
	}
}
