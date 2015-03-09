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

import android.content.Context;
import android.content.res.Configuration;
import android.os.Bundle;
import android.preference.CheckBoxPreference;
import android.preference.EditTextPreference;
import android.preference.ListPreference;
import android.preference.Preference;
import android.preference.Preference.OnPreferenceChangeListener;
import android.preference.Preference.OnPreferenceClickListener;
import android.preference.PreferenceFragment;

import com.darwino.android.app.dominodisc.R;
import com.darwino.android.platform.AbstractDarwinoSettingsActivity;
import com.darwino.commons.Platform;
import com.darwino.commons.android.ui.Dialogs;
import com.darwino.commons.httpclnt.HttpClient;
import com.darwino.commons.httpclnt.HttpClient.Authenticator;
import com.darwino.commons.httpclnt.HttpClientService;
import com.darwino.commons.json.JsonJavaFactory;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.tasks.Task;
import com.darwino.commons.tasks.TaskException;
import com.darwino.commons.tasks.TaskExecutor;
import com.darwino.commons.tasks.TaskExecutorContext;
import com.darwino.commons.tasks.TaskExecutorService;
import com.darwino.commons.util.StringUtil;
import com.darwino.mobile.platform.DarwinoActions;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileManifest;
import com.darwino.mobile.platform.DarwinoMobileManifest.Connection;
import com.darwino.mobile.platform.DarwinoMobileSettings;
import com.darwino.platform.DarwinoManifest;

/**
 * 
 */
public abstract class DarwinoSettingsActivity extends AbstractDarwinoSettingsActivity {

	public DarwinoMobileSettings.Editor propEditor;
	
	public boolean shouldSave;
	public boolean shouldRefresh;
	public boolean shouldResetApplication;
	public boolean shouldResetSocialCache;
	
	@Override
	protected void onPostCreate(Bundle savedInstanceState) {
		super.onPostCreate(savedInstanceState);
	}
	
	@Override
	protected void onDestroy() {
		if(commonTasks!=null) {
			if(shouldSave && propEditor!=null) {
				propEditor.commit();
			}
			if(shouldResetSocialCache) {
				commonTasks.resetSocialCache(null);
			}
			if(shouldResetApplication) {
				DarwinoMobileApplication.get().resetApplication();
			}
			if(shouldRefresh) {
				commonTasks.refreshUi();
			}
			commonTasks = null;
		}
		super.onDestroy();
	}
	
	protected void closeSettings() {
		finish();
	}
	
	public void saveSettings() {
		this.shouldSave = true;
	}
	
	public void refreshPage() {
		this.shouldRefresh = true;
		this.shouldSave = true;
	}
	
	public void markResetApplication() {
		this.shouldResetApplication = true;
		this.shouldRefresh = true;
		this.shouldSave = true;
	}
	
	public void markResetSocialCache() {
		this.shouldResetSocialCache = true;
	}


	@Override
	public boolean onIsMultiPane() {
		return isXLargeTablet(this);
	}
	public static boolean isXLargeTablet(Context context) {
		int size = context.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK;
		return size >= Configuration.SCREENLAYOUT_SIZE_XLARGE;
	}
	
	public abstract DarwinoActions getDarwinoTasks();

	@Override
	public void onBuildHeaders(List<Header> target) {
		DarwinoManifest mf = commonTasks.getManifest();
		DarwinoMobileManifest mobMf = mf.get(DarwinoMobileManifest.class);
			
		// Remote access
		int remote = mobMf.getRemoteConnections(); 
		if(remote!=DarwinoMobileManifest.REMOTE_NONE) {
			// Account
		    Header header = new Header();
		    header.title = "Account";
		    header.summary = "Set the current account";
		    header.fragment = AccountUsrPwdFragment.class.getName();
		    target.add(header);
		}
		// Data synchronization
		if(mobMf.isDataSynchronization() && remote!=DarwinoMobileManifest.REMOTE_NONE && mobMf.isLocalDatabase()) {
			if(mobMf.isDataSynchronization()) {
			    Header header = new Header();
			    header.title = "Data Synchronization";
			    header.summary = "Manage the synchronization options";
			    header.fragment = SynchronizationFragment.class.getName();
			    target.add(header);
			}
		}
		// Local database management
		if(mobMf.isLocalDatabase()) {
		    Header header = new Header();
		    header.title = "Manage Local DB";
		    header.summary = "Create/Remove the local database";
		    header.fragment = ManageLocalDBFragment.class.getName();
		    target.add(header);
		}
		
		buildCustomHeaders(mf,target);
		
		// About
		if(mobMf.isAbout()) {
		    Header header = new Header();
		    header.title = "About";
		    header.summary = "About this application";
		    header.fragment = AboutFragment.class.getName();
		    target.add(header);
		}
	}
	protected void buildCustomHeaders(DarwinoManifest mf, List<Header> target) {
	}
	
	
	public static class BaseDarwinoPreferenceFragment extends PreferenceFragment {
		public DarwinoSettingsActivity getDarwinoActivity() {
			return (DarwinoSettingsActivity)getActivity();
		}
		public DarwinoActions getDarwinoTasks() {
			return getDarwinoActivity().getDarwinoTasks();
		}
		public DarwinoManifest getManifest() {
			return DarwinoMobileApplication.get().getManifest();
		}
		public DarwinoMobileManifest getMobileManifest() {
			return DarwinoMobileApplication.get().getManifest().get(DarwinoMobileManifest.class);
		}
		public DarwinoMobileSettings.Editor getSettingsEditor() {
			DarwinoSettingsActivity activity = getDarwinoActivity();
			if(activity.propEditor==null) {
				activity.propEditor = DarwinoMobileApplication.get().getSettings().createEditor();
			}
			return activity.propEditor;
		}
		public boolean isNative() {
			return DarwinoMobileApplication.get().isNative();
		}
		protected void refresh() {
		}
	}

	public static class AccountUsrPwdFragment extends BaseDarwinoPreferenceFragment {
		@Override
		public void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			addPreferencesFromResource(R.xml.dwo_pref_account_usrpwd);

			// Mode
			ListPreference modePref = (ListPreference)findPreference("acc_mode");
			boolean webMode = !isNative() && getMobileManifest().isWebMode();
			if(webMode) {
				modePref.setEntries(new String[]{"Remote Data","Local Data","Web Application"});
				modePref.setEntryValues(new String[]{"0","1","2"});
			} else {
				modePref.setEntries(new String[]{"Remote Data","Local Data"});
				modePref.setEntryValues(new String[]{"0","1"});
			}
			modePref.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
				@Override
				public boolean onPreferenceChange(Preference preference, Object newValue) {
					getSettingsEditor().setConnectionMode(Integer.valueOf((String)newValue));
					getDarwinoActivity().markResetApplication();
					refresh();
					return true; // Click handled
				}
			});

			// Access to the server
			final Connection c =  getSettingsEditor().getConnection();
			EditTextPreference srvPref = (EditTextPreference)findPreference("acc_srv");
			srvPref.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
				@Override
				public boolean onPreferenceChange(Preference preference, Object newValue) {
					c.setUrl((String)newValue);
					c.setValid(false);
					getDarwinoActivity().markResetApplication();
					refresh();
					return true; // Click handled
				}
			});
			EditTextPreference usrPref = (EditTextPreference)findPreference("acc_usr");
			usrPref.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
				@Override
				public boolean onPreferenceChange(Preference preference, Object newValue) {
					c.setUserId((String)newValue);
					c.setValid(false);
					getDarwinoActivity().markResetApplication();
					refresh();
					return true; // Click handled
				}
			});
			EditTextPreference pwdPref = (EditTextPreference)findPreference("acc_pwd");
			pwdPref.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
				@Override
				public boolean onPreferenceChange(Preference preference, Object newValue) {
					c.setUserPassword((String)newValue);
					c.setValid(false);
					getDarwinoActivity().markResetApplication();
					refresh();
					return true; // Click handled
				}
			});
			Preference valPref = (Preference)findPreference("acc_validate");
			valPref.setOnPreferenceClickListener(new OnPreferenceClickListener() {
				@Override
				public boolean onPreferenceClick(Preference preference) {
					c.setValid(false);
					getDarwinoActivity().markResetSocialCache();
					getDarwinoActivity().markResetApplication();
					Task<Void> task = new Task<Void>() {
						@Override
						public Void execute(TaskExecutorContext<Void> context) throws TaskException {
							try {
								String userId = c.getUserId();
								Authenticator auth = StringUtil.isNotEmpty(userId) 
														? new HttpClient.BasicAuthenticator(userId,c.getUserPassword()) 
														: new HttpClient.AnonymousAuthenticator();
								HttpClient http = Platform.getService(HttpClientService.class).createHttpClient(JsonJavaFactory.instance,c.getUrl(),auth);
								JsonObject o = (JsonObject)http.getAsJson(new String[]{"social", "profiles", "user"});
								if(o.has("cn")) {
									c.setDn(o.getString("dn"));
									c.setCn(o.getString("cn"));
									context.updateUi(new Runnable() {
										@Override
										public void run() {
											Dialogs.infoBox(getActivity(), "Connection Successful", "The user/password has been validated by the server");
											c.setValid(true);
											refresh();
										}
									}, false);
								} else {
									context.updateUi(new Runnable() {
										@Override
										public void run() {
											Dialogs.errorBox(getActivity(), "Authentication Error", "The user/password is incorrect");
										}
									}, false);
								}
							} catch(Exception ex) {
								Platform.log(ex);
								context.updateUi(new Runnable() {
									@Override
									public void run() {
										Dialogs.errorBox(getActivity(), "Connection Error", "Error while connecting to the server.");
									}
								}, false);
							}
							return null;
						}
					};
					TaskExecutor<Void> e=Platform.getService(TaskExecutorService.class).getExecutor(true);
					e.exec(task,null);
					return true;
				}
			});
			
			// List of default connections
			final Connection[] conn = getMobileManifest().getPredefinedConnections();
			if(conn!=null && conn.length>0) {
				ListPreference connPref = (ListPreference)findPreference("acc_connections");
				String[] list = new String[conn.length];
				String[] listValues = new String[conn.length];
				for(int i=0; i<list.length; i++) {
					list[i] = conn[i].getName();
					listValues[i] = Integer.toString(i);
				}
				connPref.setEntries(list);
				connPref.setEntryValues(listValues);
				connPref.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
					@Override
					public boolean onPreferenceChange(Preference preference, Object newValue) {
						int sel = Integer.valueOf((String)newValue);
						getSettingsEditor().setConnection(conn[sel]);
						getDarwinoActivity().markResetApplication();
						refresh();
						return true; // Click handled
					}
				});
			}
			
			refresh();
		}
		@Override
		protected void refresh() {
			ListPreference syncPref = (ListPreference)findPreference("acc_mode");
			syncPref.setValue(Integer.toString(getSettingsEditor().getConnectionMode()));
			syncPref.setSummary(syncPref.getEntry());
			
			// Access to the server
			final Connection c =  getSettingsEditor().getConnection();
			EditTextPreference srvPref = (EditTextPreference)findPreference("acc_srv");
			srvPref.setText(c.getUrl());
			srvPref.setSummary(c.getUrl());
			
			EditTextPreference usrPref = (EditTextPreference)findPreference("acc_usr");
			usrPref.setText(c.getUserId());
			usrPref.setSummary(c.getUserId());

			EditTextPreference pwdPref = (EditTextPreference)findPreference("acc_pwd");
			pwdPref.setText(c.getUserPassword());
			pwdPref.setSummary(StringUtil.isNotEmpty(c.getUserPassword())?"*********":"<empty>");
			
			Preference pref = (Preference)findPreference("acc_validate");
			pref.setSummary(c.isValid()?StringUtil.format("Connection valid, user {0}, {1}",c.getCn(), c.getDn()):"<connection not valid>");
		}
	}
	public static class SynchronizationFragment extends BaseDarwinoPreferenceFragment {
		@Override
		public void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			addPreferencesFromResource(R.xml.dwo_pref_data_sync);

			Preference syncNow = (Preference) findPreference("sync_now");
			syncNow.setOnPreferenceClickListener(new OnPreferenceClickListener() {
				@Override
				public boolean onPreferenceClick(Preference preference) {
					getDarwinoActivity().getDarwinoTasks().synchronizeData();
					getDarwinoActivity().refreshPage();
					refresh();
					return true; // Click handled
			    }
			});
			
			ListPreference syncPref = (ListPreference)findPreference("sync_frequency");
			syncPref.setEntries(new String[]{"Not enabled","Immediate","1 Minute","5 Minutes","10 minutes","15 minutes","30 minutes","1 Hour","2 Hours","Daily"});
			syncPref.setEntryValues(new String[]{"","0","1m","5m","10m","15m","30m","1h","2h","1d"});
			syncPref.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
				@Override
				public boolean onPreferenceChange(Preference preference, Object newValue) {
					getSettingsEditor().setSyncPeriod((String)newValue);
					getDarwinoActivity().markResetApplication(); // to reset the sync thread
					refresh();
					return true; // Click handled
				}
			});
			
			CheckBoxPreference pushImmPref = (CheckBoxPreference)findPreference("sync_pushimm");
			pushImmPref.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
				@Override
				public boolean onPreferenceChange(Preference preference, Object newValue) {
					getSettingsEditor().setSyncPushImmediately((Boolean)newValue);
					getDarwinoActivity().markResetApplication(); // to reset the sync thread
					refresh();
					return true; // Click handled
				}
			});
			
			CheckBoxPreference notifyPref = (CheckBoxPreference)findPreference("sync_notify");
			notifyPref.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
				@Override
				public boolean onPreferenceChange(Preference preference, Object newValue) {
					getSettingsEditor().setSyncNotification((Boolean)newValue);
					getDarwinoActivity().saveSettings();
					refresh();
					return true; // Click handled
				}
			});
			
			refresh();
		}
		@Override
		protected void refresh() {
			ListPreference syncPref = (ListPreference)findPreference("sync_frequency");
			String sp = getSettingsEditor().getSyncPeriod();
			syncPref.setValue(sp!=null?sp:"");
			syncPref.setSummary(syncPref.getEntry());
			
			CheckBoxPreference pushImmPref = (CheckBoxPreference)findPreference("sync_pushimm");
			pushImmPref.setChecked(getSettingsEditor().isSyncPushImmediately());

			CheckBoxPreference notifyPref = (CheckBoxPreference)findPreference("sync_notify");
			notifyPref.setChecked(getSettingsEditor().isSyncNotify());
		}
	}
	public static class ManageLocalDBFragment extends BaseDarwinoPreferenceFragment {
		@Override
		public void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			addPreferencesFromResource(R.xml.dwo_pref_data_manage);
			
			Preference erase = (Preference) findPreference("mgt_cleardata");
			erase.setOnPreferenceClickListener(new OnPreferenceClickListener() {
				@Override
				public boolean onPreferenceClick(Preference preference) {
					getDarwinoActivity().getDarwinoTasks().eraseLocalData();
					getDarwinoActivity().refreshPage();
					return true; // Click handled
			    }
			});
			
			Preference ccache = (Preference)findPreference("mgt_clearsocial");
			ccache.setOnPreferenceClickListener(new OnPreferenceClickListener() {
				@Override
				public boolean onPreferenceClick(Preference preference) {
					commonTasks.resetSocialCache();
					return true;
				}
			});

			EditTextPreference pwdPref = (EditTextPreference)findPreference("mgt_recreate");
			pwdPref.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
				@Override
				public boolean onPreferenceChange(Preference preference, Object newValue) {
					try {
						String newKey = (String)newValue;
						getDarwinoActivity().getDarwinoTasks().deleteLocalSqliteFile();
						getSettingsEditor().setDbEncryptionKey(newKey);
						getDarwinoActivity().markResetApplication();
						refresh();
					} catch(Throwable ex) {
						Platform.log(ex);
					}
					return true; // Click handled
				}
			});
			
			refresh();
		}
		@Override
		protected void refresh() {
			EditTextPreference pwdPref = (EditTextPreference)findPreference("mgt_recreate");
			String sp = getSettingsEditor().getDbEncryptionKey();
			pwdPref.setText(sp!=null?sp:"");
			pwdPref.setSummary(StringUtil.isNotEmpty(sp)?"Database is encrypted":"Database is not encrypted");
		}
	}
	
	public static class AboutFragment extends BaseDarwinoPreferenceFragment {
		@Override
		public void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			addPreferencesFromResource(R.xml.dwo_pref_about);
			
			Preference about = (Preference) findPreference("about_about");
			about.setTitle(getManifest().getLabel());
			about.setSummary(getManifest().getDescription());
			about.setOnPreferenceClickListener(new OnPreferenceClickListener() {
				@Override
				public boolean onPreferenceClick(Preference preference) {
					return true; // Click handled
			    }
			});
			
			Preference reset = (Preference) findPreference("about_reset");
			reset.setOnPreferenceClickListener(new OnPreferenceClickListener() {
				@Override
				public boolean onPreferenceClick(Preference preference) {
					if(Dialogs.yesNo(getActivity(), "This will reset all the settings and delete the local data. Do you want to continue?")==Dialogs.DLG_YES) {
						getSettingsEditor().initDefault(getManifest());
						getDarwinoActivity().markResetApplication();
					}
					return true; // Click handled
			    }
			});
			
			refresh();
		}
	}
}
