package com.darwino.robovm.common.settings;

import java.util.Arrays;

import org.robovm.apple.foundation.NSString;
import org.robovm.apple.foundation.NSUserDefaults;

import com.darwino.mobile.platform.DarwinoMobileManifest.Connection;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileSettings;
import com.darwino.robovm.common.settings.controls.SettingsField;


public class AccountViewController extends AbstractSettingsViewController {

	private static final String[] EXEC_MODE_LABELS_LOCAL = {
		"Remote Data",
		"Local Data"
	};
	private static final Object[] EXEC_MODE_VALUES_LOCAL = {
		0,
		1
	};
	private static final String[] EXEC_MODE_LABELS_WEB = {
		"Remote Data",
		"Local Data",
		"Web Application"
	};
	private static final Object[] EXEC_MODE_VALUES_WEB = {
		0,
		1,
		2
	};
	
	@Override
	public void viewDidLoad() {
		super.viewDidLoad();
		
		DarwinoMobileSettings settings = DarwinoMobileApplication.get().getSettings();
		final DarwinoMobileSettings.Editor editor = SettingsViewController.getInstance().getSettingsEditor();
		final NSUserDefaults userDefaults = NSUserDefaults.getStandardUserDefaults();
		
		final Connection c = editor.getConnection();
		
		boolean webMode = !isNative() && getMobileManifest().isWebMode();
		
		if(webMode) {
			addSettingsField(
					SettingsField.picker("Execution Mode", settings.getConnectionMode(), Arrays.asList(EXEC_MODE_LABELS_WEB), Arrays.asList(EXEC_MODE_VALUES_WEB), new SettingsField.SettingsChangeCallback() {
						@Override public void handle(Object newValue) {
							int intValue = (Integer)newValue;
							editor.setConnectionMode(intValue);
							userDefaults.put("acc_mode", intValue);
							SettingsViewController.getInstance().markResetApplication();
						}
					})
			);
		} else {
			addSettingsField(
					SettingsField.picker("Execution Mode", settings.getConnectionMode(), Arrays.asList(EXEC_MODE_LABELS_LOCAL), Arrays.asList(EXEC_MODE_VALUES_LOCAL), new SettingsField.SettingsChangeCallback() {
						@Override public void handle(Object newValue) {
							int intValue = (Integer)newValue;
							editor.setConnectionMode(intValue);
							userDefaults.put("acc_mode", intValue);
							SettingsViewController.getInstance().markResetApplication();
						}
					})
			);
		}
		
		addSettingsFields(
				SettingsField.text("Server", "", settings.getConnection().getUrl(), new SettingsField.SettingsChangeCallback() {
					@Override public void handle(Object newValue) {
						String stringValue = (String)newValue;
						c.setUrl(stringValue);
						userDefaults.put("acc_srv", new NSString(stringValue));
						SettingsViewController.getInstance().markResetApplication();
					}
				}),
				SettingsField.text("User Name", "", settings.getConnection().getUserId(), new SettingsField.SettingsChangeCallback() {
					@Override public void handle(Object newValue) {
						String stringValue = (String)newValue;
						c.setUserId(stringValue);
						userDefaults.put("acc_usr", new NSString(stringValue));
						SettingsViewController.getInstance().markResetApplication();
					}
				}),
				SettingsField.password("Password", "", settings.getConnection().getUserPassword(), new SettingsField.SettingsChangeCallback() {
					@Override public void handle(Object newValue) {
						String stringValue = (String)newValue;
						c.setUserPassword(stringValue);
						userDefaults.put("acc_pwd", new NSString(stringValue));
						SettingsViewController.getInstance().markResetApplication();
					}
				})
		);
	}


}
