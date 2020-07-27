/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts;

import java.util.HashMap;
import java.util.Map;

import com.darwino.jsonstore.Session;
import com.darwino.script.DSLibrary;
import com.darwino.script.DSProgramRuntimeContext;
import com.darwino.script.library.PropertyMapLibrary;

/**
 * Script environment for the tasks
 */
public class ScriptsProgramContext extends DSProgramRuntimeContext {
	
	private static DSLibrary getGlobalObjects(Session session) {
		Map<String,Object> values = new HashMap<>();
		values.put("session", session);
		return new PropertyMapLibrary(values);
	}
		 
	private ScriptsTask task;
	private Session session;
	private ScriptTaskSocket socket;
	
	public ScriptsProgramContext(ScriptsTask task, Session session, ScriptTaskSocket socket) {
		super(ScriptsEnvironment.instance,null,getGlobalObjects(session));
		this.task = task;
		this.session = session;
		this.socket = socket;
	}
	
	@Override
	public boolean isInterrupted() {
		return task.isStopRequested();
	}
	
	public ScriptsTask getTask() {
		return task;
	}
	
	public Session getSession() {
		return session;
	}
	
	public ScriptTaskSocket getSocket() {
		return socket;
	}
}
