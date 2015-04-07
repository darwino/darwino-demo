package com.darwino.robovm.common.settings;

import com.darwino.commons.util.NotImplementedException;
import com.darwino.robovm.common.settings.controls.SettingsField;

public class LocalDBViewController extends AbstractSettingsViewController {
	@Override
	public void viewDidLoad() {
		super.viewDidLoad();
		
		addSettingsFields(
				SettingsField.action("Erase Local Data", "Erase the local application data", new SettingsField.SettingsActionCallback() {
					@Override public void handle(SettingsField field) {
						try {
						SettingsViewController.getInstance().getDarwinoTasks().eraseLocalData();
						} catch(NotImplementedException nie) {
							// Not yet
						}
						toast("Erased local data");
					}
				}),
				SettingsField.action("Erase Social Cache", "Erase the local social data cache", new SettingsField.SettingsActionCallback() {
					@Override public void handle(SettingsField field) {
						SettingsViewController.getInstance().getDarwinoTasks().resetSocialCache();
					}
				}),
				SettingsField.action("Recreate Local DB", "Database is not encrypted", new SettingsField.SettingsActionCallback() {
					@Override public void handle(SettingsField field) {
						// TODO Prompt for encryption key
						SettingsViewController.getInstance().getDarwinoTasks().deleteLocalSqliteFile();
						SettingsViewController.getInstance().markResetApplication();
					}
				})
		);
	}
}
