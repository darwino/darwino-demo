/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package com.darwinodb.app.scripts;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.tasks.Task;
import com.darwino.commons.tasks.TaskException;
import com.darwino.commons.tasks.TaskExecutorContext;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.jsonstore.LocalJsonDBServer;
import com.darwino.jsonstore.Session;
import com.darwino.platform.DarwinoApplication;
import com.darwino.script.DSRuntimeException;
import com.darwino.script.DSScript;

/**
 * Simple task.
 * 
 * @author Philippe Riand
 */
public class ScriptsTask extends Task<Void> {
	
	public enum TYPE {
		SCRIPT,
		COMMAND
	}
	private class SocketWriter extends Writer {
		StringBuilder b = new StringBuilder();
		@Override
	    public void write(char cbuf[], int off, int len) throws IOException {
			int nlPos = -1;
	    	for(int i=0; i<len; i++) {
	    		char c = cbuf[off+i];
	    		b.append(c);
	    		if(c=='\n') {
	    			nlPos = b.length();
	    		}
	    	}
	    	if(nlPos>0) { // That will be the last one
	    		if(nlPos==b.length()) {
	    			flush();
	    		} else {
	    			socket.emitConsole(b.subSequence(0, nlPos).toString());
		    		b.delete(0, nlPos);
	    		}
	    	}
	    }
		@Override
	    public void flush() {
			socket.emitConsole(b.toString());
			b.setLength(0);
	    }
		@Override
		public void close() throws IOException {
			this.flush();
		}
	}
	
	private ScriptTaskSocket socket;
	private TYPE type;
	private String script;
	private long startTs;
	
	private volatile boolean stopRequested;
	
	public ScriptsTask(ScriptTaskSocket socket, TYPE type, String script) {
		this.socket = socket;
		this.type = type;
		this.script = script;
	}
	
	public boolean isStopRequested() {
		return stopRequested;
	}
	
	public void requestStop() {
		Platform.log("Stop requested!");
		stopRequested = true;
	}
	
	public void endTask() {
		long endTs = System.currentTimeMillis();
		socket.emitConsole(StringUtil.format("\nExecution time ~{0}ms\n",endTs-startTs));
		this.socket.endTask();
		this.socket = null;
	}
	
	public Session createSession() throws JsonException {
		LocalJsonDBServer server = DarwinoApplication.get().getLocalJsonDBServer();
		return server.createSystemSession(null);
	}

	@Override
	public Void execute(TaskExecutorContext context) throws TaskException {
		try {
			this.startTs = System.currentTimeMillis();
			try {
				context.getTaskProgress().beginTask(0,null);
				try {
					Session session = createSession();
					try {
						ScriptsProgramContext ctx = createProgramRuntimeContext(session);
						Object result = null;
						switch(type) {
							case SCRIPT: {
								DSScript expr = ctx.getEnvironment().createScript(script);
								result = expr.execute(ctx);
							} break;
							case COMMAND: {
								DSScript expr = ctx.getEnvironment().createFunction("execCommand", script);
								result = expr.execute(ctx);
							} break;
						}
						if(result!=null) {
							socket.emitConsole(result.toString()+'\n');
						}
					} finally {
						StreamUtil.close(session);
					}
				} finally {
					context.getTaskProgress().endTask(0,null);
				}
			} catch(DSRuntimeException t) {
				socket.emitError(t);
			} catch(Throwable t) {
				socket.emitError(t);
			} finally {
				endTask();
				this.socket = null;
			}
		} finally {
		}
		return null;
	}
	
	protected ScriptsProgramContext createProgramRuntimeContext(Session session) {
		ScriptsProgramContext ctx = new ScriptsProgramContext(this,session,socket);
		PrintWriter sw = new PrintWriter(new SocketWriter());
		ctx.setContextStdOut(sw);
		ctx.setContextStderr(sw);
		return ctx;
	}
}
