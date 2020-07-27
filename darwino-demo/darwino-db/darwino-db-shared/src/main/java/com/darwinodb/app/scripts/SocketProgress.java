/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.tasks.TaskExecutorContext;
import com.darwino.commons.tasks.TaskProgress;
import com.darwino.commons.tasks.impl.TaskExecutorImpl;
import com.darwino.commons.util.DateTimePeriod;
import com.darwino.commons.util.ProgressEvaluator;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.replication.ReplicationChanges;

/**
 * Task progress for a socket
 * 
 */
public class SocketProgress extends TaskProgress {

	private ProgressEvaluator eval = new ProgressEvaluator();
	private ScriptTaskSocket socket;

	private int taskId;

	private String title;
	private String message;
	private boolean started;
	private boolean finished;
	private boolean error;
	private int estimated;
	private int processed;
	private Object status;
	@SuppressWarnings("unused")
	private Object notification;

	private long lastUpdateTime;
	private long updateDelay;
		
	
	public SocketProgress(ScriptTaskSocket socket) {
		this.socket = socket;
		this.updateDelay = 500; 
	}
	
	public SocketProgress createChild() {
		return new SocketProgress(this.socket);
	}
	
	@Override
	public void beginExecute(TaskExecutorContext context) {		
		this.taskId = context.getTask().getId();
		NotificationCenter.get().addRunningTask(context);
	}
	
	@Override
	public void endExecute(TaskExecutorContext context) {		
		NotificationCenter.get().removeRunningTask(context);
		this.taskId = 0;
	}

	private void reset() {
		super.init(null,null);
		this.started = this.finished = this.error = false;
		this.estimated = this.processed = 0;
		this.status = this.notification = null;
	}

	@Override
	public void init(String title, String message) {
		reset();
		
		this.title = title;
		this.message = message;
		
		TaskExecutorContext context = TaskExecutorImpl.getExecutorContextUnchecked();
		if(context!=null) {
			this.taskId = context.getTask().getId();
		}

		if(message!=null) {
			_out(StringUtil.toString(message)+'\n');
		}
	}
	
	@Override
	public void notify(Object notified) {
		this.notification = notified;
		if(notified instanceof ReplicationChanges) {
			_out(notified.toString()+'\n');
		}
	}
	
	@Override
	public void error(Object status) {
		this.error = true;
		this.status = status;
		_err(StringUtil.toString(status)+'\n');
	}
	
	@Override
	public void beginTask(int estimated, Object status) {
		this.started = true;
		this.finished = false;
		this.estimated = estimated;
		this.processed = 0;
		this.status = status;

		eval.setStartTime(System.currentTimeMillis());
		eval.setEstimated(estimated);
		lastUpdateTime = -1;
		sendToSocket();
	}
	
	@Override
	public boolean updateTask(int processed, Object status) {
		this.processed = processed;
		this.status = status;

		long now = System.currentTimeMillis();
		if(shouldUpdate(now, processed)) {
			sendToSocket();
			lastUpdateTime = now;
		}
		
		if(socket.isStopRequested()) {
			return true;
		}
		return false; // Do not cancel!!!
	}
	
	@Override
	public void endTask(int processed, Object status) {
		this.started = false;
		this.finished = true;
		this.processed = processed;
		this.status = status;

		sendToSocket();
	}
	
	public void sendToSocket() {
		if(socket!=null || NotificationCenter.get().hasSockets()) {
			try {
				JsonObject progress= buildProgress();
				JsonObject o = JsonObject.of(
						"command","progress",
						"progress",progress);
				String json = o.toJson();
				if(socket!=null) {
					socket.getServerSocket().emit(json);
				}
				NotificationCenter.get().emit(json);
			} catch(Exception ex) {
				Platform.log(ex);
			}
		}
	}
	
	public JsonObject buildProgress() {
		String status = formatStatus();
		JsonObject progress = JsonObject.of(
			"taskId", taskId,
			"title", title,
			"message", message,
			"started", started,
			"finished", finished,
			"error", error,
			"estimated", estimated,
			"processed", processed,
			"percent",eval.percentCompleted(processed),
			"status", status
		);
		return progress;
	}
	
	public void _out(String msg) {
		socket.emitConsole(msg);
	}
	
	public void _err(String msg) {
		socket.emitError(msg);
	}
	
	protected boolean shouldUpdate(long now, int processed) {
		if(lastUpdateTime==0) {
			return true;
		}
		long ellapsed = now-lastUpdateTime;
		if(ellapsed<updateDelay) {
			return false;
		}
		return true;
	}
	
	private String formatStatus() {
		StringBuilder b = new StringBuilder();
		if(status instanceof String) {
			b.append(status.toString());
		}
		if(estimated>0) {
			if(b.length()>0) {
				b.append(" ");
			}
			b.append(StringUtil.format("{0}/{1}",processed,eval.getEstimated()));
			if(eval.getStartTime()>0) {
				b.append(StringUtil.format(", {0}%, {1}",eval.percentCompleted(processed),DateTimePeriod.formatPeriod(eval.remainingTime(processed),'s')));
			}
		}
		return b.toString();
	}
}
