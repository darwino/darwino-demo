package com.darwino.ios.platform.settings;

import com.darwino.ios.platform.settings.controls.SettingsField;

public class IOSLocalDBSettingsPane extends AbstractIOSSettingsPane {
	@Override
	public void viewDidLoad() {
		super.viewDidLoad();
		
		addSettingsFields(
				SettingsField.action("Erase Local Data", "Erase the local application data", new SettingsField.SettingsActionCallback() {
					@Override public void handle(SettingsField field) {
						IOSSettingsRoot.getInstance().getDarwinoTasks().eraseLocalData();
					}
				}),
				SettingsField.action("Erase Social Cache", "Erase the local social data cache", new SettingsField.SettingsActionCallback() {
					@Override public void handle(SettingsField field) {
						IOSSettingsRoot.getInstance().getDarwinoTasks().resetSocialCache();
					}
				}),
				SettingsField.action("Recreate Local DB", "Database is not encrypted", new SettingsField.SettingsActionCallback() {
					@Override public void handle(SettingsField field) {
						// TODO Prompt for encryption key
						IOSSettingsRoot.getInstance().getDarwinoTasks().deleteLocalSqliteFile();
						IOSSettingsRoot.getInstance().markResetApplication();
					}
				})
		);
	}
}
