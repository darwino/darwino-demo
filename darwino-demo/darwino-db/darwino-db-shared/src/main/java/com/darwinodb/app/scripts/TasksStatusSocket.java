/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts;

import java.io.IOException;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;

/**
 * Socket that render the status for all the tasks.
 * 
 */
public class TasksStatusSocket extends BaseSocket {
	
	public TasksStatusSocket(ServerSocket serverSocket) {
		super(serverSocket);
	}
    
	private void emit(JsonObject o) throws JsonException, IOException {
		String json = o.toJson();
		NotificationCenter.get().emit(json);
	}

	public void emitTaskList(JsonArray tasks) {
		try {
			JsonObject o = JsonObject.of(
					"command","tasklist",
					"tasks", tasks);
			emit(o);
		} catch(Exception e) {
			Platform.log(e);
		}
	}

	public void emitMetadataChanged() {
		try {
			JsonObject o = JsonObject.of(
					"command","metachanged");
			emit(o);
		} catch(Exception e) {
			Platform.log(e);
		}
	}

    @Override
	public void onCommand(String command, JsonObject parameters) {
    	if("listtasks".equals(command)) {
    		NotificationCenter.get().notifyTasksChanged(this);
    	} else if("stop".equals(command)) {
			ScriptsTask task = NotificationCenter.get().getTaskById(parameters.getInt("taskId"));
    		if(task!=null) {
    			task.requestStop();
    		}
    	}
    }
    
    @Override
	public void onConnect() {
    	NotificationCenter.get().addSocket(this);
    }
    
    @Override
	public void onDisconnect() {
    	NotificationCenter.get().removeSocket(this);
    }
}
