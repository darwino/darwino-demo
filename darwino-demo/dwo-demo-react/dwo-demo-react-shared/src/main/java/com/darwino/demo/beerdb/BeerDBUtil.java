package com.darwino.demo.beerdb;

import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.meta._Database;

public enum BeerDBUtil {
	;
	
	public static final int BEERDB_STORES_VERSION = 2;
	
	public static final String STORE_BEERS = "beers"; //$NON-NLS-1$
	public static final String STORE_BRANDS = "brands"; //$NON-NLS-1$
	public static final String STORE_BREWERIES = "breweries"; //$NON-NLS-1$
	public static final String STORE_CITIES = "cities"; //$NON-NLS-1$
	public static final String STORE_CONTINENTS = "continents"; //$NON-NLS-1$
	public static final String STORE_COUNTRIES = "countries"; //$NON-NLS-1$
	public static final String STORE_REGIONS = "regions"; //$NON-NLS-1$

	@SuppressWarnings("nls")
	public static void addBeerDbStores(_Database db) throws JsonException {
		db.addStore(STORE_BEERS).setLabel("BeerDB: Beers");
		db.addStore(STORE_BRANDS).setLabel("BeerDB: Brands");
		db.addStore(STORE_BREWERIES).setLabel("BeerDB: Breweries");
		db.addStore(STORE_CITIES).setLabel("BeerDB: Cities");
		db.addStore(STORE_CONTINENTS).setLabel("BeerDB: Continents");
		db.addStore(STORE_COUNTRIES).setLabel("BeerDB: Countries");
		db.addStore(STORE_REGIONS).setLabel("BeerDB: Regions");
	}
}
