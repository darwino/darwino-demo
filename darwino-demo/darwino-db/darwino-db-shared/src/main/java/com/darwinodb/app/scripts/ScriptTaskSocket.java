/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.tasks.TaskExecutor;
import com.darwino.commons.util.AbstractException;
import com.darwino.commons.util.StringUtil;
import com.darwino.script.DSRuntimeException;
import com.darwinodb.app.scripts.ScriptsTask.TYPE;

/**
 * Socket for a single task execution, like a script or CLI.
 */
public class ScriptTaskSocket extends BaseSocket {
	
	private ScriptsTask task;
	
	public ScriptTaskSocket(ServerSocket serverSocket) {
		super(serverSocket);
	}
	
	public boolean isStopRequested() {
		if(task!=null) {
			return task.isStopRequested();
		}
		return true;
	}

	private void emit(JsonObject o) throws JsonException, IOException {
		String json = o.toJson();
		getServerSocket().emit(json);
		NotificationCenter.get().emit(json);
	}
	
	public void emitConsole(String text) {
		if(task!=null) {
			try {
				JsonObject o = JsonObject.of(
						"command","console",
						"taskId",task.getId(),
						"text",text);
				emit(o);
			} catch(Exception e) {
				Platform.log(e);
			}
		}
	}

	public void emitError(String text) {
		if(task!=null) {
			try {
				JsonObject o = JsonObject.of(
						"command","error",
						"taskId",task.getId(),
						"text",text);
				emit(o);
			} catch(Exception e) {
				Platform.log(e);
			}
		}
	}

	public void emitError(Throwable ex) {
		if(task!=null) {
			try {
				Platform.log(ex);
				StringBuilder b = new StringBuilder();
				b.append("> Execution Error\n");
				for( Throwable t=ex; t!=null; t=AbstractException.getCause(t)) {
					String msg = null; 
					if(t instanceof DSRuntimeException) {
						msg = ((DSRuntimeException)t).getUndecoratedMessage();
					} else {
						msg = t.getMessage();					
					}
					if(StringUtil.isNotEmpty(msg)) {
						b.append("    > ");
						b.append(msg);					
						b.append("\n");
					}
				}
				JsonObject o = JsonObject.of(
						"command","error",
						"taskId",task.getId(),
						"text",b.toString());
				emit(o);
			} catch(Exception e) {
				Platform.log(e);
			}
		}
	}
	
	public void endTask() {
		this.task = null;
		getServerSocket().closeSocket();
	} 
	
	
    @Override
	public void onCommand(String command, JsonObject parameters) {
    	SocketProgress progress = new SocketProgress(this);
    	Map<String,Object> p = new HashMap<String,Object>();
    	p.put(TaskExecutor.PARAM_TASKPROGRESS,progress);
    	if("script".equals(command)) {
    		executeScript(parameters.getString("text"),progress,p);
    	} else if("cli".equals(command)) {
    		executeCommand(parameters.getString("text"),progress,p);
    	} else if("stop".equals(command)) {
    		if(task!=null) {
    			task.requestStop();
    		}
    	}
    }
    
	private void executeScript(String script, SocketProgress progress, Map<String,Object> parameters) {
		progress.init("Execute Script",null);
		this.task = new ScriptsTask(this,TYPE.SCRIPT,script);
		NotificationCenter.get().getTaskScheduler().executeTask(task,parameters);		
	}
	
	private void executeCommand(String command, SocketProgress progress, Map<String,Object> parameters) {
		progress.init("Execute Command",command);
		this.task = new ScriptsTask(this,TYPE.COMMAND,command);
		NotificationCenter.get().getTaskScheduler().executeTask(task,parameters);		
	}
	
    
    @Override
	public void onError() {
    	this.endTask();
    }
}
