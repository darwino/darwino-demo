package com.darwino.robovm.common.settings;

import java.util.Arrays;

import org.robovm.apple.foundation.NSString;
import org.robovm.apple.foundation.NSUserDefaults;

import com.darwino.commons.util.NotImplementedException;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileSettings;
import com.darwino.mobile.platform.DarwinoMobileManifest.Connection;
import com.darwino.robovm.common.settings.controls.SettingsField;

public class SynchronizationViewController extends AbstractSettingsViewController {
	private static final String[] FREQUENCY_LABELS = {
		"Not Enabled",
		"Immediate",
		"1 Minute",
		"5 Minutes",
		"10 Minutes",
		"15 Minutes",
		"30 Minutes",
		"1 Hour",
		"2 Hours",
		"Daily"
	};
	private static final Object[] FREQUENCY_VALUES = {
		"",
		"0",
		"1m",
		"5m",
		"10m",
		"15m",
		"30m",
		"1h",
		"2h",
		"1d"
	};
	
	@Override
	public void viewDidLoad() {
		super.viewDidLoad();
		
		DarwinoMobileSettings settings = DarwinoMobileApplication.get().getSettings();
		final DarwinoMobileSettings.Editor editor = SettingsViewController.getInstance().getSettingsEditor();
		final NSUserDefaults userDefaults = NSUserDefaults.getStandardUserDefaults();
		
		addSettingsFields(
				SettingsField.action("Synchronize Now", "", new SettingsField.SettingsActionCallback() {
					@Override public void handle(SettingsField field) {
						try {
							SettingsViewController.getInstance().getDarwinoTasks().synchronizeData();
						} catch(NotImplementedException nie) {
							// TODO Remove when the exception is no longer thrown
						}

						toast("Synchronized data");
					}
				}),
				SettingsField.picker("Synchronization Frequency", "", settings.getSyncPeriod(), Arrays.asList(FREQUENCY_LABELS), Arrays.asList(FREQUENCY_VALUES), new SettingsField.SettingsChangeCallback() {
					@Override public void handle(SettingsField field, Object newValue) {
						String stringValue = (String)newValue;
						editor.setSyncPeriod(stringValue);
						userDefaults.put("sync_frequency", new NSString(stringValue));
						SettingsViewController.getInstance().markResetApplication();
					}
				}),
				SettingsField.bool("Push Changes Immediately", "Pushes the local changes to the server as soon as possible", settings.isSyncPushImmediately(), new SettingsField.SettingsChangeCallback() {
					@Override public void handle(SettingsField field, Object newValue) {
						boolean boolValue = (Boolean)newValue;
						editor.setSyncPushImmediately(boolValue);
						userDefaults.put("sync_pushim", boolValue);
						SettingsViewController.getInstance().markResetApplication();
					}
				}),
				SettingsField.bool("Notify Successful Sync", "Notify the user after the synchronization was successful", settings.isSyncNotify(), new SettingsField.SettingsChangeCallback() {
					@Override public void handle(SettingsField field, Object newValue) {
						boolean boolValue = (Boolean)newValue;
						editor.setSyncPushImmediately(boolValue);
						userDefaults.put("sync_notify", boolValue);
						SettingsViewController.getInstance().markResetApplication();
					}
				})
		);
	}
}
