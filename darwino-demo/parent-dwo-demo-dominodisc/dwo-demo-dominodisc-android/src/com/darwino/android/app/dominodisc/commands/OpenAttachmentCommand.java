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

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.webkit.MimeTypeMap;
import android.widget.Toast;

import com.darwino.android.platform.hybrid.DarwinoAndroidHybridApplication;
import com.darwino.commons.tasks.TaskException;
import com.darwino.commons.tasks.TaskExecutor;
import com.darwino.commons.tasks.TaskExecutorContext;
import com.darwino.commons.util.PathUtil;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.jsonstore.Attachment;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Session;
import com.darwino.mobile.platform.commands.AppCommand;
import com.darwino.platform.DarwinoContext;


/**
 * Command for opening a file. 
 */
public class OpenAttachmentCommand extends AppCommand {

	public OpenAttachmentCommand() {
		super("Open a file",TaskExecutor.DIALOG_NONE);
	}

	@Override
	public Void execute(TaskExecutorContext context) throws TaskException {
		try {
			String database = (String)context.getParameters().get("database");
			String store = (String)context.getParameters().get("store");
			String unid = (String)context.getParameters().get("unid");
			String name = (String)context.getParameters().get("name");
			String file = (String)context.getParameters().get("file");
			String mimeType = (String)context.getParameters().get("mimeType");

			if(StringUtil.isEmpty(file)) {
				file = name;
			}
	
			Session session = DarwinoContext.get().getSession();
			Document doc = session.getDatabase(database).getStore(store).loadDocument(unid);
			Attachment att = doc.getAttachment(name);
	
			// set the path where we want to save <span id="IL_AD12" class="IL_AD">the file</span>
	        File SDCardRoot = Environment.getExternalStorageDirectory();
	        File sysFile = new File(SDCardRoot, file);
	        FileOutputStream os = new FileOutputStream(sysFile);
	        try {
	        	att.read(os);
	        } finally {
	        	StreamUtil.close(os);
	        }
	
			mimeType = null; //att.getMimeType();
			if(StringUtil.isEmpty(mimeType)) {
				String ext = PathUtil.getExtension(name);
				if(StringUtil.isNotEmpty(ext)) {
					mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);
				}
			}
	        
			final DarwinoAndroidHybridApplication app = (DarwinoAndroidHybridApplication)DarwinoAndroidHybridApplication.get();
			Intent newIntent = new Intent(Intent.ACTION_VIEW);
			newIntent.setDataAndType(Uri.fromFile(sysFile),mimeType);
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
		} catch(Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}
}
