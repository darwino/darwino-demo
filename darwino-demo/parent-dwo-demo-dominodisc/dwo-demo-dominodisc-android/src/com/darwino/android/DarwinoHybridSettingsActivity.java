/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc 2014-2015.
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.     
 */

package com.darwino.android;

import java.util.List;

import android.os.Bundle;
import android.preference.Preference;
import android.preference.Preference.OnPreferenceClickListener;

import com.darwino.android.app.dominodisc.R;
import com.darwino.android.platform.hybrid.DarwinoAndroidHybridActions;
import com.darwino.mobile.platform.DarwinoActions;
import com.darwino.mobile.platform.DarwinoHybridActions;
import com.darwino.platform.DarwinoManifest;

/**
 * 
 */
public class DarwinoHybridSettingsActivity extends DarwinoSettingsActivity {

	@Override
	public DarwinoActions getDarwinoTasks() {
		return new DarwinoAndroidHybridActions(this);
	}
	
	@Override
	protected void buildCustomHeaders(DarwinoManifest mf, List<Header> target) {
		// Tools
		if(mf.isToolsExplorer() || mf.isToolsDesigner()) {
		    Header header = new Header();
		    header.title = "Tools";
		    header.summary = "Use the extra tools";
		    header.fragment = ToolsFragment.class.getName();
		    target.add(header);
		}
	}
	
	public static class BaseHybridDarwinoPreferenceFragment extends BaseDarwinoPreferenceFragment {
		@Override
		public DarwinoHybridSettingsActivity getDarwinoActivity() {
			return (DarwinoHybridSettingsActivity)super.getDarwinoActivity();
		}
		@Override
		public DarwinoHybridActions getDarwinoTasks() {
			return (DarwinoHybridActions)super.getDarwinoTasks();
		}
	}
	
	public static class ToolsFragment extends BaseHybridDarwinoPreferenceFragment {
		@Override
		public void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			addPreferencesFromResource(R.xml.dwo_pref_tools);
			
			Preference explorer = findPreference("tools_explorer");
			explorer.setOnPreferenceClickListener(new OnPreferenceClickListener() {
				@Override
				public boolean onPreferenceClick(Preference preference) {
					getSettingsEditor().setMainPage(DarwinoManifest.APP_EXPLORER);
					getDarwinoActivity().markResetApplication();
					getDarwinoActivity().closeSettings();
					return true; // Click handled
			    }
			});
			refresh();
		}
	}
	
}
