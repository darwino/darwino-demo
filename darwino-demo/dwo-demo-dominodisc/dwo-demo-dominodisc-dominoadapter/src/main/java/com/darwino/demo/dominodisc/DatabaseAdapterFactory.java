package com.darwino.demo.dominodisc;

import com.darwino.domino.jstore.dsl.DSLDatabaseAdapterFactory;

public class DatabaseAdapterFactory extends DSLDatabaseAdapterFactory {

	@Override
	public String[] getScriptNames() {
		return new String[] { "domdisc" }; //$NON-NLS-1$
	}

}
