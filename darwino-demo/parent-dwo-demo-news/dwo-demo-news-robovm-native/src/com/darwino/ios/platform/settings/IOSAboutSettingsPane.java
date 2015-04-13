package com.darwino.ios.platform.settings;

import com.darwino.commons.ios.ui.Dialogs;
import com.darwino.ios.platform.settings.controls.SettingsField;
import com.darwino.mobile.platform.DarwinoMobileSettings;
import com.darwino.platform.DarwinoManifest;


public class IOSAboutSettingsPane extends AbstractIOSSettingsPane {
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
		final DarwinoMobileSettings.Editor editor = IOSSettingsRoot.getInstance().getSettingsEditor();
		
		addSettingsFields(
			SettingsField.readOnly(manifest.getLabel(), manifest.getDescription(), null),
			SettingsField.action("Reset Settings to Default", "Reset all the settings to default value and delete the local database", new SettingsField.SettingsActionCallback() {
				@Override public void handle(SettingsField field) {
					Dialogs.DialogCallback callback = new Dialogs.DialogCallback() {
						@Override
						public void handleResponse(int responseValue) {
							if(responseValue == Dialogs.DLG_YES) {
								editor.initDefault(manifest);
								IOSSettingsRoot.getInstance().markResetApplication();
							}
						}
					};
					Dialogs.yesNo(callback, "Reset Settings to Default", "This will reset all the settings and delete the local data. Do you want to continue?");
				}
			})
		);
	}
}
