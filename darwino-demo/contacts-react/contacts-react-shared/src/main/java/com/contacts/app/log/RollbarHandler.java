/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

package com.contacts.app.log;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.log.LogContext;
import com.darwino.commons.log.LogHandler;
import com.darwino.commons.log.LogRecord;
import com.darwino.commons.security.acl.User;
import com.darwino.commons.security.acl.UserException;
import com.darwino.commons.util.AbstractException;
import com.darwino.commons.util.DarwinoVersion;
import com.darwino.commons.util.Format;
import com.darwino.commons.util.StringUtil;
import com.darwino.platform.DarwinoContext;
import com.rollbar.api.payload.data.Person;
import com.rollbar.notifier.Rollbar;
import com.rollbar.notifier.config.ConfigBuilder;
import com.rollbar.notifier.provider.Provider;

/**
 * Pre-mortem handler using Rollbar.
 * 
 */
public class RollbarHandler implements LogHandler {
	
    private static final DateFormat fullDateFormat = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss"); // $NON-NLS-1$
	
	private Rollbar rollbar;
	private boolean checked;

	private String clientAccessToken;
	private String serverAccessToken;
	private String readAccessToken;
	private String writeAccessToken;
	
	private String environment;
	
	public RollbarHandler() {
		this.environment = Platform.isDevelopment() ? "development" : "production";
	}

	
	public String getClientAccessToken() {
		return clientAccessToken;
	}
	public void setClientAccessToken(String clientAccessToken) {
		this.clientAccessToken = clientAccessToken;
	}

	public String getServerAccessToken() {
		return serverAccessToken;
	}
	public void setServerAccessToken(String serverAccessToken) {
		this.serverAccessToken = serverAccessToken;
		this.rollbar = null;
		this.checked = false;
	}

	public String getReadAccessToken() {
		return readAccessToken;
	}
	public void setReadAccessToken(String readAccessToken) {
		this.readAccessToken = readAccessToken;
	}

	public String getWriteAccessToken() {
		return writeAccessToken;
	}
	public void setWriteAccessToken(String writeAccessToken) {
		this.writeAccessToken = writeAccessToken;
	}

	
	
	//
	// Server login
	//

	@Override
	public boolean isCollectAllLogs() {
		// Get all the logs going to rollbar
		return true;
	}
	
	public synchronized Rollbar getRollbar() {
		if(rollbar==null) {
			String tk = getServerAccessToken();
			if(StringUtil.isNotEmpty(tk)) {
				ConfigBuilder cb = ConfigBuilder
					.withAccessToken(tk)
					.environment(environment)
					.codeVersion(DarwinoVersion.CURRENT_BUILD)
					.person(new Provider<Person>() {
						@Override
						public Person provide() {
							User u = DarwinoContext.get().getUser();
							Person p = new Person.Builder()
											.id(u.getDn())
											.username(u.getCn())
											.email(userAttribute(u,User.ATTR_EMAIL))
											.build();
							return p;
						}
					})
					//.context(context)
					.handleUncaughtErrors(true);
				Rollbar rollbar = Rollbar.init(cb.build());
				this.rollbar = rollbar;
			} else {
				if(!checked) {
					Platform.log("Missing server access token for Rollbar");
					checked = true;
				}
			}
		}
		return rollbar;
	}
	
	/**
	 * Emit the logs to the target.
	 * @param cause if the messages are emitted because of an exception.
	 */
	@Override
	public boolean emitLogs(LogContext context, Throwable t, boolean error) {
		Rollbar rb = getRollbar();
		if(rb!=null) {
			StringBuilder b = new StringBuilder();

			// The first line will be displayed as a title in Rollbar
			// If there is an exception, we add it here
			if(t!=null) {
				String title = t.getLocalizedMessage();
				b.append(Format.format("Server {0}, {1}\n",context.getContextId(),title));
			} else {
				b.append(Format.format("Server {0}\n",context.getContextId()));
			}
			
			// Log
			b.append("\n------------------------------\n");
			b.append("Log: ");
			b.append(fullDateFormat.format(new Date(context.getTimestamp())));
			b.append("\n");
			for( Iterator<LogRecord> it = context.records(); it.hasNext(); ) {
				LogRecord r = it.next();
				Format.format(b, r.getMessage(), r.getParams() );
				b.append('\n');
			}
			
			// Exception
			if(t!=null) {
				b.append("\n------------------------------\n");
				b.append("Exception:\n");
				try {
					b.append(AbstractException.exceptionAsJson(t,true,true).toJson(false));
				} catch(Exception ex) {
					Platform.log(ex);
				}
				b.append('\n');
			}
			String msg = b.toString();
			if(error) {
				rollbar.error(msg);
				//rollbar.error(t, msg);
			} else {
				rollbar.info(msg);
			}
		}
		
		return true;
	}

	
	//
	// Client login
	//
	
	public JsonObject getJSClientConfig() {
		JsonObject config = new JsonObject();
		String accessToken = getClientAccessToken();
		if(StringUtil.isNotEmpty(accessToken)) {
			// Base configuration for rollbar
			config.putBoolean("enabled", true);
			config.putString("accessToken", accessToken);
			config.putBoolean("captureUncaught", true);
			config.putBoolean("captureUnhandledRejections", true);
			
			// Create the payload that will be sent with each request 
			User user = DarwinoContext.get().getUser();
			JsonObject payload = JsonObject.of(
				"environment", environment,
				"person", JsonObject.of(
					"id", user.getDn(),
					"username", user.getCn(),
					"email", userAttribute(user,User.ATTR_EMAIL)
				),
				"code_version", DarwinoVersion.CURRENT_BUILD
			);
			config.putObject("payload", payload);
		}
		return config;
	}
	private String userAttribute(User user, String attr) {
		try {
			Object s = user.getAttribute(attr);
			return s!=null ? s.toString() : null;
		} catch(UserException ex) {
			return null;
		}
	}
}
