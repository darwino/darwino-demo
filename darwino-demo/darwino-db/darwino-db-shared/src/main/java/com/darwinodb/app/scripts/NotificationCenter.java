/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.tasks.Task;
import com.darwino.commons.tasks.TaskExecutorContext;
import com.darwino.commons.tasks.TaskExecutorService;
import com.darwino.commons.tasks.TaskProgress;
import com.darwino.commons.tasks.scheduler.TaskScheduler;

/**
 * Notification Center
 * 
 * This class is used to send notification to the listeners 
 */
public class NotificationCenter {
	
	private static NotificationCenter instance = new NotificationCenter();
	public static NotificationCenter get() {
		return instance;
	}
	
	private TaskScheduler scheduler;
	private List<TaskExecutorContext> runningTasks = new ArrayList<TaskExecutorContext>();
	private List<TasksStatusSocket> sockets = new ArrayList<>();
	
	public NotificationCenter() {
		this.scheduler = Platform.getService(TaskScheduler.class);
	}
	
	public synchronized void addRunningTask(TaskExecutorContext taskContext) {
		runningTasks.add(taskContext);
		notifyTasksChanged(null);
	}
	
	public synchronized void removeRunningTask(TaskExecutorContext taskContext) {
		runningTasks.remove(taskContext);
		notifyTasksChanged(null);
	}

	public TaskScheduler getTaskScheduler() {
		return scheduler;
	}
	
	public TaskExecutorService getTaskExecutorService() {
		return scheduler.getTaskExecutorService();
	}
	
	
	public boolean hasSockets() {
		return sockets.size()>0;
	}
	
	public synchronized void addSocket(TasksStatusSocket socket) {
		sockets.add(socket);
	}
	
	public synchronized void removeSocket(TasksStatusSocket socket) {
		sockets.remove(socket);
	}
	
	public synchronized void emit(String json) {
		if(!sockets.isEmpty()) {
			for(TasksStatusSocket sock: sockets) {
				sock.getServerSocket().emit(json);
			}
		}
	}
	
	public synchronized ScriptsTask getTaskById(int taskId) {
		for(TaskExecutorContext e: runningTasks) {
			Task<?> t = e.getTask();
			if((t instanceof ScriptsTask) && t.getId()==taskId) {
				return (ScriptsTask)t;
			}
		}
		return null;
	}

	public synchronized void notifyTasksChanged(TasksStatusSocket socket) {
		if(socket!=null || !sockets.isEmpty()) {
			JsonArray a = new JsonArray(runningTasks.size());
			for(TaskExecutorContext e: runningTasks) {
				TaskProgress p = e.getTaskProgress();
				if(p instanceof SocketProgress) {
					SocketProgress sp = (SocketProgress)p;
					a.add(sp.buildProgress());
				}
			}

			a.sort(new Comparator<Object>() {
				@Override
				public int compare(Object o1, Object o2) {
					return ((JsonObject)o1).getInt("taskId")-((JsonObject)o2).getInt("taskId");
				}
			});
			
			if(socket!=null) {
				socket.emitTaskList(a);
			} else {
				for(TasksStatusSocket sock: sockets) {
					sock.emitTaskList(a);
				}
			}
		}
	}
	
	public synchronized void notifyMetadataChanged(TasksStatusSocket socket) {
		if(socket!=null || !sockets.isEmpty()) {
			if(socket!=null) {
				socket.emitMetadataChanged();
			} else {
				for(TasksStatusSocket sock: sockets) {
					sock.emitMetadataChanged();
				}
			}
		}
	}
}
