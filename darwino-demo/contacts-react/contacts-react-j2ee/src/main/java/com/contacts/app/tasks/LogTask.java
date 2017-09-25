/*!COPYRIGHT HEADER! 
 *
 */

package com.contacts.app.tasks;

import java.util.Date;

import com.darwino.commons.Platform;
import com.darwino.commons.tasks.Task;
import com.darwino.commons.tasks.TaskException;
import com.darwino.commons.tasks.TaskExecutorContext;
import com.darwino.commons.util.DateFormatter;

/**
 * Simple task.
 * 
 * @author Philippe Riand
 */
public class LogTask extends Task<Void> {

	@Override
	public Void execute(TaskExecutorContext context) throws TaskException {
		Platform.log("Task scheduled, time:{0}", DateFormatter.Standard.LONG_DATETIME.getFormat().format(new Date()));
		return null;
	}
}
