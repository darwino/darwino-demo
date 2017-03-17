package com.darwino.demo.beerdb;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.log.Logger;
import com.darwino.commons.tasks.Task;
import com.darwino.commons.tasks.TaskException;
import com.darwino.commons.tasks.TaskExecutorContext;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.demo.react.app.AppDatabaseDef;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.LocalJsonDBServer;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.Store;
import com.darwino.platform.DarwinoApplication;
import com.darwino.rdbc.SqlResultSet;
import com.darwino.rdbc.impl.SqlStatementImpl;
import com.darwino.rdbc.sqlite.SQLite;
import com.darwino.rdbc.sqlite.SqliteConnection;

public class BeerDBImporter extends Task<Void> {
	
	private static final Logger log = Platform.logService().getLogMgr("Importer"); //$NON-NLS-1$
	static {
		log.setLogLevel(Logger.LOG_DEBUG_LEVEL);
	}

	@Override
	public Void execute(TaskExecutorContext context) throws TaskException {
		if(log.isInfoEnabled()) {
			log.info("{0}: Importing beer DB", getClass().getSimpleName());
		}
		
		try {

			DarwinoApplication app = DarwinoApplication.get();
			@SuppressWarnings("resource")
			LocalJsonDBServer server = app.getLocalJsonDBServer();
			Session session = server.createSystemSession(null);
			try {
				Database db = session.getDatabase(AppDatabaseDef.DATABASE_NAME);
				
				// Check to see if the first store already has documents
				Store beers = db.getStore(BeerDBUtil.STORE_BEERS);
				if(beers.documentCount() > 0) {
					if(log.isInfoEnabled()) {
						log.info("Beer DB already contains documents - exiting");
					}
					return null;
				}

				
				// Copy and open the SQLite DB
				File tempDb = File.createTempFile("beerdb", ".db"); //$NON-NLS-1$ //$NON-NLS-2$
				try {
					@SuppressWarnings("resource")
					FileOutputStream fos = new FileOutputStream(tempDb);
					try {
						@SuppressWarnings("resource")
						InputStream is = BeerDBImporter.class.getResourceAsStream("beer.db"); //$NON-NLS-1$
						try {
							StreamUtil.copyStream(is, fos);
						} finally {
							StreamUtil.close(is);
						}
					} finally {
						StreamUtil.close(fos);
					}
					SQLite sqlite = SQLite.get();
					long hDB = sqlite.open(tempDb.getAbsolutePath());
					SqliteConnection conn = new SqliteConnection(hDB);
					try {
						importDocs(db, conn, BeerDBUtil.STORE_BEERS, "BeerDb::Model::Beer"); //$NON-NLS-1$
						importDocs(db, conn, BeerDBUtil.STORE_BRANDS, null);
						importDocs(db, conn, BeerDBUtil.STORE_BREWERIES, "BeerDb::Model::Brewery"); //$NON-NLS-1$
						importDocs(db, conn, BeerDBUtil.STORE_CITIES, null);
						importDocs(db, conn, BeerDBUtil.STORE_CONTINENTS, null);
						importDocs(db, conn, BeerDBUtil.STORE_COUNTRIES, null);
						importDocs(db, conn, BeerDBUtil.STORE_REGIONS, null);
						
					} finally {
						conn.close();
					}
				} finally {
					if(tempDb.exists()) {
						tempDb.delete();
					}
				}
			} finally {
				session.close();
			}
			
		} catch(IOException e) {
			throw new TaskException(e);
		} catch (SQLException e) {
			throw new TaskException(e);
		} catch (JsonException e) {
			throw new TaskException(e);
		}
		
		if(log.isInfoEnabled()) {
			log.info("{0}: Beer import complete", getClass().getSimpleName());
		}
		
		return null;
	}
	
	private static void importDocs(Database db, SqliteConnection conn, String storeId, String taggableType) throws JsonException {
		if(log.isTraceEnabled()) {
			log.trace("{0}: Importing documents for store {1}", BeerDBImporter.class.getSimpleName(), storeId);
		}
		Store beers = db.getStore(storeId);
		
		SqlStatementImpl stmt = conn.prepareStatement(StringUtil.format("select * from {0}", storeId), 0); //$NON-NLS-1$
		try {
			SqlResultSet rs = stmt.executeQuery();
			try {
				createDocuments(beers, conn, rs, taggableType);
			} finally {
				rs.close();
			}
		} finally {
			stmt.close();
		}
	}

	private static void createDocuments(Store store, SqliteConnection conn, SqlResultSet rs, String taggableType) throws JsonException {
		int colCount = rs.getColumnCount();
		String[] columnNames = new String[colCount];
		for(int i = 0; i < colCount; i++) {
			columnNames[i] = rs.getColumnName(i+1);
		}
		
		while(rs.next()) {
			Document doc = store.newDocument();
			for(int i = 0; i < colCount; i++) {
				String col = columnNames[i];
				Object val = rs.get(i+1);
				doc.set(col, val);
			}
			
			if(StringUtil.isNotEmpty(taggableType)) {
				SqlStatementImpl tagQuery = conn.prepareStatement("select key from taggings,tags where taggable_id=? and taggable_type=? and taggings.tag_id=tags.id", 0); //$NON-NLS-1$
				try {
					SqlResultSet tagRs = tagQuery.executeQuery(doc.getInt("id"), taggableType); //$NON-NLS-1$
					try {
						List<String> tags = new ArrayList<String>();
						while(tagRs.next()) {
							String tag = StringUtil.toString(tagRs.get(1));
							tags.add(tag);
						}
						doc.set(Document.SYSTEM_TAGS, tags);
					} finally {
						tagRs.close();
					}
				} finally {
					tagQuery.close();
				}
			}
			
			if(log.isDebugEnabled()) {
				log.debug("{0}: Importing doc {1}", BeerDBImporter.class.getSimpleName(), doc.asJson(Document.JSON_METADATA|Document.JSON_CONTENT));
			}
			
			doc.save();
		}
	}
}
