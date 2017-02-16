package com.darwino.demo.dominodisc.service;

import com.darwino.commons.services.AbstractHttpService;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.platform.DarwinoApplication;

public class RedirService extends AbstractHttpService {
	@Override
	protected void doGet(HttpServiceContext context) throws Exception {
		sendRedirect(context);
	}
	
	@Override
	protected void doPost(HttpServiceContext context) throws Exception {
		sendRedirect(context);
	}
	
	private void sendRedirect(HttpServiceContext context) {
		String redir = DarwinoApplication.get().getManifest().getMainPageUrl();
		String path = context.getRequestContextPath();
		
		context.setResponseStatus(302);
		context.setResponseHeader("Location", path + "/" + redir); //$NON-NLS-1$ //$NON-NLS-2$
	}
}
