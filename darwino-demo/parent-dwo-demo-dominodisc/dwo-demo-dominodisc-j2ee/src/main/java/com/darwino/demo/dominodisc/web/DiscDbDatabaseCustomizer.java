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

package com.darwino.demo.dominodisc.web;

import java.util.List;

import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.sql.DBSchema;
import com.darwino.jsonstore.sql.SqlUtils;
import com.darwino.jsonstore.sql.impl.full.JdbcDatabaseCustomizer;
import com.darwino.sql.drivers.DBDriver;
import com.ibm.commons.util.StringUtil;



/**
 * Database customizer.
 */
public class DiscDbDatabaseCustomizer extends JdbcDatabaseCustomizer {
	
	public DiscDbDatabaseCustomizer(DBDriver driver) {
		super(driver,null);
	}
	
	@Override
	public int getVersion(String databaseName) {
		// Version 1:
		//		- Added an index to the sort by cdate desc
		return 1;
	}

	@SuppressWarnings("incomplete-switch")
	@Override
	public void getAlterStatements(List<String> statements, String schema, String databaseName, int existingVersion) throws JsonException {
		if(existingVersion<1) {
			switch(getDBDriver().getDatabaseType()) {
				case POSTGRESQL: {
					statements.add(StringUtil.format(
							"CREATE INDEX {0} ON {1} ({2},{3},{4} DESC NULLS FIRST,{5} ASC NULLS FIRST)",
								getCustomIndexName(schema, databaseName, SqlUtils.SUFFIX_DOCUMENT, 1),
								SqlUtils.sqlTableName(schema,databaseName,SqlUtils.SUFFIX_DOCUMENT),
								DBSchema.FDOC_INSTID,
								DBSchema.FDOC_STOREID,
								DBSchema.FDOC_CDATE,
								DBSchema.FDOC_UNID
							)
						);
				} break;
//				case DB2: {
//					statements.add(StringUtil.format(
//							"CREATE INDEX {0} ON {1} ({2},{3},{4} DESC,{5} ASC)",
//								getCustomIndexName(schema, databaseName, SqlUtils.SUFFIX_DOCUMENT, 1),
//								SqlUtils.sqlTableName(schema,databaseName,SqlUtils.SUFFIX_DOCUMENT),
//								DBSchema.FDOC_INSTID,
//								DBSchema.FDOC_STOREID,
//								DBSchema.FDOC_CDATE,
//								DBSchema.FDOC_UNID
//							)
//						);
//				} break;
			}
		}
	}
}
