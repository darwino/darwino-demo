/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands;

import java.io.PrintWriter;
import java.lang.reflect.Field;
import java.util.Map;
import java.util.concurrent.Callable;

import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.util.StringUtil;
import com.darwino.script.DSRuntimeException;
import com.darwinodb.app.scripts.ScriptsProgramContext;

import picocli.CommandLine.Command;

/**
 * Base command Object
 */
public abstract class AbstractCommand implements Callable<Integer> {
	
	private ScriptsProgramContext ctx;
	
	public AbstractCommand() {
	}
	
	public String getCommandName() {
		Command cmd = getClass().getAnnotation(Command.class);
		return cmd.name();
	}
	
	@Override
	public abstract Integer call() throws Exception;


	public final Integer execute(JsonObject parameters) throws Exception {
		if(parameters!=null && !parameters.isEmpty()) {
			Class<?> clazz = getClass();
			for(Map.Entry<String,Object> e: parameters.entrySet()) {
				String name = e.getKey();
				try {
					Object v = parameters.get(name);
					if(v!=null) {
						Field f = clazz.getField(name);
						if(!isAssignableFrom(f.getType(),v.getClass())) {
							throw new DSRuntimeException(null,
											"Command {0}: cannot assign a value of type {1} to the parameter {2} of type {3}",
											getCommandName(),classString(v),classString(f.getType()));
						}
						assignTo(f, v);
					}
				} catch (NoSuchFieldException | SecurityException ex) {
					throw new DSRuntimeException(null,"Command {0}: invalid parameter {1}",getCommandName(),name);
				}			
			}
		}
		return call();
	}
	private boolean isAssignableFrom(Class<?> fc, Class<?> vc) {
		if( vc==Boolean.class ) {
			return fc==Boolean.class || fc==Boolean.TYPE;
		}
		if( Number.class.isAssignableFrom(vc) ) {
			return fc==Byte.class || fc==Byte.TYPE
				|| fc==Short.class || fc==Short.TYPE
				|| fc==Integer.class || fc==Integer.TYPE
				|| fc==Long.class || fc==Long.TYPE
				|| fc==Float.class || fc==Float.TYPE
				|| fc==Double.class || fc==Double.TYPE;
		}
		return fc.isAssignableFrom(vc);
	}
	private void assignTo(Field f, Object value) throws IllegalArgumentException, IllegalAccessException {
		Class<?> fc = f.getType();
		if( fc==Boolean.class || fc==Boolean.TYPE ) {
			f.set(this, ((Boolean)value).booleanValue());			
		} else if( fc==Byte.class || fc==Byte.TYPE ) {
			f.set(this, ((Byte)value).byteValue());			
		} else if( fc==Short.class || fc==Short.TYPE ) {
			f.set(this, ((Short)value).shortValue());			
		} else if( fc==Integer.class || fc==Integer.TYPE ) {
			f.set(this, ((Integer)value).intValue());			
		} else if( fc==Long.class || fc==Long.TYPE ) {
			f.set(this, ((Long)value).longValue());			
		} else if( fc==Float.class || fc==Float.TYPE ) {
			f.set(this, ((Float)value).floatValue());			
		} else if( fc==Double.class || fc==Double.TYPE ) {
			f.set(this, ((Double)value).doubleValue());			
		} else {
			f.set(this, value);
		}
	}
	private static String classString(Object o) {
		if(o==null) {
			return "null";
		}
		Class<?> c = o instanceof Class ? (Class<?>)o : o.getClass();
		if(Number.class.isAssignableFrom(c) || String .class.isAssignableFrom(c) || Boolean.class.isAssignableFrom(c)) {
			return c.getSimpleName();
		}
		if(JsonObject.class.isAssignableFrom(c)) {
			return "Object";
		}
		if(JsonArray.class.isAssignableFrom(c)) {
			return "Array";
		}
		return c.getName();
	}

	
	public ScriptsProgramContext getContext() {
		return ctx;
	}
	
	public void setContext(ScriptsProgramContext ctx) {
		this.ctx = ctx;
	}
	
	public PrintWriter getStdout() {
		return getContext().getStdout();
	}
	
	public void print(String msg, Object...p) {
		getStdout().print(StringUtil.format(msg,p));
	}

	public void println(String msg, Object...p) {
		getStdout().println(StringUtil.format(msg,p));
	}
}
