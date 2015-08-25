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

package com.darwino.android.app.dominodisc.commands;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.webkit.MimeTypeMap;
import android.widget.Toast;

import com.darwino.android.platform.hybrid.DarwinoAndroidHybridApplication;
import com.darwino.commons.Platform;
import com.darwino.commons.tasks.TaskException;
import com.darwino.commons.tasks.TaskExecutor;
import com.darwino.commons.tasks.TaskExecutorContext;
import com.darwino.commons.util.PathUtil;
import com.darwino.commons.util.StringUtil;
import com.darwino.mobile.platform.commands.AppCommand;


/**
 * Command for opening a file. 
 */
public class OpenFileCommand extends AppCommand {

	public OpenFileCommand() {
		super("Open a file",TaskExecutor.DIALOG_NONE);
	}
	
	@Override
	public Void execute(TaskExecutorContext context) throws TaskException {
		String url = (String)context.getParameters().get("url");
Platform.log("Open File: {0}",url);		
		if(StringUtil.isNotEmpty(url)) {
			String mimeType = null; //(String)context.getParameters().get("mimeType");
			if(StringUtil.isEmpty(mimeType)) {
				String ext = PathUtil.getExtension(url);
				if(StringUtil.isNotEmpty(ext)) {
					mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);
				}
			}
			final DarwinoAndroidHybridApplication app = (DarwinoAndroidHybridApplication)DarwinoAndroidHybridApplication.get();
			Intent newIntent = new Intent(Intent.ACTION_VIEW);
			newIntent.setDataAndType(Uri.parse(url),mimeType);
			newIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			try {
			    app.getMainActivity().startActivity(newIntent);
			} catch (ActivityNotFoundException e) {
				final String msg = StringUtil.format("No handler for file {0}", mimeType);
				context.updateUi(new Runnable() {
					@Override
					public void run() {
					    Toast.makeText(app.getMainActivity(), msg, Toast.LENGTH_LONG).show();
					}
				}, false);
			}		
		}
		return null;
	}
}
