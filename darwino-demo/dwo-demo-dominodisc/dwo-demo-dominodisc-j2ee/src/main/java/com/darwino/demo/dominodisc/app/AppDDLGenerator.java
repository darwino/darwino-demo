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

import com.darwino.commons.util.UUIDGenerator;
import com.darwino.j2ee.jstore.JdbcDdlGenerator;
import com.darwino.jsonstore.sql.impl.full.JdbcDatabaseCustomizer;
import com.darwino.platform.DarwinoManifest;
import com.darwino.sql.drivers.DBDriver;
import com.darwino.sql.drivers.DBDriverFactory;

/**
 * Application DDL Generator.
 * 
 * Use this class to get the DDL generated and deploy to a database, if the application cannot
 * run the deployment automatically.
 */
public class AppDDLGenerator {
	
	public static void main(String[] args) {
		try {
			// Set the parameters here
			String dbType = DBDriverFactory.DB_POSTGRESQL;
			String dbVersion = null; // Null means default
			String dbSchema = null; // Schema for the tables
			
			// Load the driver for the desired DB here
			DBDriver dbDriver = DBDriverFactory.get().find(dbType,dbVersion);

			DarwinoManifest mf = new AppManifest(null);
			
			// Create the customizer
			JdbcDatabaseCustomizer customizer = new AppDatabaseCustomizer(dbDriver);
			
			// Create the generator
			// The replicaId should be kept the same when the database is upgraded and the replicated data should be kept
			// A newly generated ID will actually restart the replication from scratch
			String replicaId = UUIDGenerator.uuid();
			JdbcDdlGenerator gen = new JdbcDdlGenerator(dbDriver, dbSchema, mf.getDatabaseFactory(), customizer, replicaId);

			// Generate the DDL for all the databases to System.out (Java console)
			gen.generateDdl(System.out,mf.getDatabases());
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
}
