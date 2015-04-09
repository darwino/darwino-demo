package com.darwino.robovm.common.settings;

import org.robovm.apple.uikit.UITableViewController;

import com.darwino.commons.robovm.ui.Dialogs;
import com.darwino.mobile.platform.DarwinoMobileSettings;
import com.darwino.platform.DarwinoManifest;
import com.darwino.robovm.common.settings.controls.SettingsField;


public class AboutViewController extends AbstractSettingsViewController {
	@Override
	public void viewDidLoad() {
		super.viewDidLoad();
		
		/*
		 * Preference about = (Preference) findPreference("about_about");
			about.setTitle(getManifest().getLabel());
			about.setSummary(getManifest().getDescription());
			about.setOnPreferenceClickListener(new OnPreferenceClickListener() {
				@Override
				public boolean onPreferenceClick(Preference preference) {
					return true; // Click handled
			    }
			});
		 */
		
		final DarwinoManifest manifest = getManifest();
		final DarwinoMobileSettings.Editor editor = SettingsViewController.getInstance().getSettingsEditor();
		
		addSettingsFields(
			SettingsField.readOnly(manifest.getLabel(), manifest.getDescription(), null),
			SettingsField.action("Reset Settings to Default", "Reset all the settings to default value and delete the local database", new SettingsField.SettingsActionCallback() {
				@Override public void handle(SettingsField field) {
					Dialogs.DialogCallback callback = new Dialogs.DialogCallback() {
						@Override
						public void handleResponse(int responseValue) {
							if(responseValue == Dialogs.DLG_YES) {
								editor.initDefault(manifest);
								SettingsViewController.getInstance().markResetApplication();
							}
						}
					};
					Dialogs.yesNo(callback, "Reset Settings to Default", "This will reset all the settings and delete the local data. Do you want to continue?");
				}
			})
		);
	}
}
