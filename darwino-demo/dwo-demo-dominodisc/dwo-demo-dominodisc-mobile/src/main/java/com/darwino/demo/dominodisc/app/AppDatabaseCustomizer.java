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

package com.darwino.demo.dominodisc.app;

import java.util.List;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.sql.DBSchema;
import com.darwino.jsonstore.sql.SqlUtils;
import com.darwino.jsonstore.sql.impl.sqlite.SqliteDatabaseCustomizer;



/**
 * Database customizer.
 */
public class AppDatabaseCustomizer extends SqliteDatabaseCustomizer {
	
	public static final int VERSION = 3;
	
	public AppDatabaseCustomizer() {
	}
	
	@Override
	public int getVersion(String databaseName) {
		// 1-
		//		- Added an index to the sort by cdate desc
		// 2-
		//		- Made the index non null first for all the drivers
		// 3-
		//		- Added index on the creation user
		//		- Added an index on the JSON expression for the author
		return VERSION;
	}

	@Override
	public void getAlterStatements(List<String> statements, String schema, String databaseName, int existingVersion) throws JsonException {
		if(existingVersion==VERSION) {
			// Ok, we are good!
			return;
		}
		
		if(existingVersion==1) {
			statements.add(StringUtil.format(
				"CREATE INDEX {0} ON {1} ({2},{3},{4} DESC,{5} ASC)",
					getCustomIndexName(schema, databaseName, SqlUtils.SUFFIX_DOCUMENT, 2),
					SqlUtils.sqlTableName(schema,databaseName,SqlUtils.SUFFIX_DOCUMENT),
					DBSchema.FDOC_INSTID,
					DBSchema.FDOC_STOREID,
					DBSchema.FDOC_CDATE,
					DBSchema.FDOC_UNID
				)
			);
		}

		if(existingVersion<3) {
			statements.add(StringUtil.format(
					"CREATE INDEX {0} ON {1} ({2},{3},{4},{5} DESC)",
						getCustomIndexName(schema, databaseName, SqlUtils.SUFFIX_DOCUMENT, 3),
						SqlUtils.sqlTableName(schema,databaseName,SqlUtils.SUFFIX_DOCUMENT),
						DBSchema.FDOC_INSTID,
						DBSchema.FDOC_STOREID,
						DBSchema.FDOC_CUSER,
						DBSchema.FDOC_CDATE
					)
				);
			statements.add(StringUtil.format(
				"CREATE INDEX {0} ON {1} ({2},{3},{4})",
					getCustomIndexName(schema, databaseName, SqlUtils.SUFFIX_DOCUMENT, 4),
					SqlUtils.sqlTableName(schema,databaseName,SqlUtils.SUFFIX_DOCUMENT),
					DBSchema.FDOC_INSTID,
					DBSchema.FDOC_STOREID,
					"json_extract(JSON,'$._writers.from[0]')"	
				)
			);
		}
	}
}
