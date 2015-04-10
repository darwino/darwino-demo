package com.darwino.ios.platform.settings;

import java.util.Arrays;

import org.robovm.apple.foundation.NSString;
import org.robovm.apple.foundation.NSUserDefaults;

import com.darwino.commons.Platform;
import com.darwino.commons.httpclnt.HttpClient;
import com.darwino.commons.httpclnt.HttpClientService;
import com.darwino.commons.httpclnt.HttpClient.Authenticator;
import com.darwino.commons.json.JsonJavaFactory;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.tasks.Task;
import com.darwino.commons.tasks.TaskException;
import com.darwino.commons.tasks.TaskExecutor;
import com.darwino.commons.tasks.TaskExecutorContext;
import com.darwino.commons.tasks.TaskExecutorService;
import com.darwino.commons.util.StringUtil;
import com.darwino.ios.platform.settings.controls.SettingsField;
import com.darwino.mobile.platform.DarwinoMobileManifest.Connection;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileSettings;


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
					SettingsField.picker("Execution Mode", "", settings.getConnectionMode(), Arrays.asList(EXEC_MODE_LABELS_WEB), Arrays.asList(EXEC_MODE_VALUES_WEB), new SettingsField.SettingsChangeCallback() {
						@Override public void handle(SettingsField field, Object newValue) {
							int intValue = (Integer)newValue;
							editor.setConnectionMode(intValue);
							userDefaults.put("acc_mode", intValue);
							SettingsViewController.getInstance().markResetApplication();
						}
					})
			);
		} else {
			addSettingsField(
					SettingsField.picker("Execution Mode", "", settings.getConnectionMode(), Arrays.asList(EXEC_MODE_LABELS_LOCAL), Arrays.asList(EXEC_MODE_VALUES_LOCAL), new SettingsField.SettingsChangeCallback() {
						@Override public void handle(SettingsField field, Object newValue) {
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
					@Override public void handle(SettingsField field, Object newValue) {
						String stringValue = (String)newValue;
						c.setUrl(stringValue);
						userDefaults.put("acc_srv", new NSString(stringValue));
						SettingsViewController.getInstance().markResetApplication();
					}
				}),
				SettingsField.text("User Name", "", settings.getConnection().getUserId(), new SettingsField.SettingsChangeCallback() {
					@Override public void handle(SettingsField field, Object newValue) {
						String stringValue = (String)newValue;
						c.setUserId(stringValue);
						userDefaults.put("acc_usr", new NSString(stringValue));
						SettingsViewController.getInstance().markResetApplication();
					}
				}),
				SettingsField.password("Password", "", settings.getConnection().getUserPassword(), new SettingsField.SettingsChangeCallback() {
					@Override public void handle(SettingsField field, Object newValue) {
						String stringValue = (String)newValue;
						c.setUserPassword(stringValue);
						userDefaults.put("acc_pwd", new NSString(stringValue));
						SettingsViewController.getInstance().markResetApplication();
					}
				}),SettingsField.action("Validate Connection", "", new SettingsField.SettingsActionCallback() {
					@Override public void handle(final SettingsField field) {
						field.setSubtitle("Validating...");

						// TODO implement these properly
//						getDarwinoActivity().markResetSocialCache();
//						getDarwinoActivity().markResetApplication();
						SettingsViewController.getInstance().markResetApplication();
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
									if(o.containsKey("cn")) {
										c.setDn(o.getString("dn"));
										c.setCn(o.getString("cn"));
										context.updateUi(new Runnable() {
											@Override
											public void run() {
												field.setSubtitle("Connection Successful");
												alert("Connection Successful", "The user/password has been validated by the server");
												c.setValid(true);
//												refresh();
											}
										}, false);
									} else {
										context.updateUi(new Runnable() {
											@Override
											public void run() {
												field.setSubtitle("Authentication Error");
												alert("Authentication Error", "The user/password is incorrect");
											}
										}, false);
									}
								} catch(Exception ex) {
									Platform.log(ex);
									ex.printStackTrace();
									context.updateUi(new Runnable() {
										@Override
										public void run() {
											field.setSubtitle("Connection Error");
											alert("Connection Error", "Error while connecting to the server");
										}
									}, false);
								}
								return null;
							}
						};
						TaskExecutor<Void> e=Platform.getService(TaskExecutorService.class).getExecutor(true);
						e.exec(task,null);
						
						
						c.setValid(false);
					}
				}),
				SettingsField.action("Predefined Connection", "Select a predefined connection from the list", new SettingsField.SettingsActionCallback() {
					@Override public void handle(SettingsField field) {
						// TODO implement this
					}
				})
		);
	}


}
