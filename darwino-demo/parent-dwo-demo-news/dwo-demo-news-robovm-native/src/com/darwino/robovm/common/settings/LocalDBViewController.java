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
							// TODO Remove when the exception is no longer thrown
						}
						toast("Erased local data");
					}
				}),
				SettingsField.action("Erase Social Cache", "Erase the local social data cache", new SettingsField.SettingsActionCallback() {
					@Override public void handle(SettingsField field) {
						try {
							SettingsViewController.getInstance().getDarwinoTasks().resetSocialCache();
						} catch(NotImplementedException nie) {
							// TODO Remove when the exception is no longer thrown
						}
						toast("Erased local social data");
					}
				}),
				SettingsField.action("Recreate Local DB", "Database is not encrypted", new SettingsField.SettingsActionCallback() {
					@Override public void handle(SettingsField field) {
						// TODO Prompt for encryption key
						try {
						SettingsViewController.getInstance().getDarwinoTasks().deleteLocalSqliteFile();
						} catch(NotImplementedException nie) {
							// TODO Remove when the exception is no longer thrown
						}
						SettingsViewController.getInstance().markResetApplication();
						toast("Recreated local DB");
					}
				})
		);
	}
}
