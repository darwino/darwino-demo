Domino Discussion Database
==========================

The Domino discussion database example shows a Darwino application that replicates with the standard Discussion Database template in Domino.

This example currently requires Darwino Enterprise Edition, as it relies on the use of instance IDs for replication.

Building the Example
====================

The Darwino application (the "dwo-demo" projects) has no special dependencies beyond the normal Darwino libraries from Maven. However, the Domino plugin projects depend on the Darwino Domino adapter as well as the XPages runtime update site.

During a Maven build, Tycho will resolve the Darwino adapter automatically from the Maven repository; however, Eclipse is not capable of doing so. This can be worked around by either removing the plugin projects (within the "dominodisc-eclipse" folder) from Eclipse (but not the filesystem) or by adding the Domino adapter to Eclipse's Target Platform.

The XPages runtime, however, is not public and so requires some configuration. Darwino uses the same Maven conventions as the [OpenNTF Domino API](https://github.com/OpenNTF/org.openntf.domino/wiki/How-to-build-the-OpenDominoAPI#downloading-and-configuring-the-ibm-domino-update-site), namely using a property named "notes-platform" in your Maven settings.xml set to point to the [Update Site for Build Management](http://openntf.org/main.nsf/project.xsp?r=project/IBM%20Domino%20Update%20Site%20for%20Build%20Management) from OpenNTF.

Running the Example
===================

To replicate with a Domino server, install the Domino connector (found in the core Darwino download) and the update site project from this tree. The Darwino application looks to the "darwino.properties" file for several properties to control replication. For example, to enable replication with a Domino server running locally and with a database named "disc.nsf", set these properties:

	discdb.sync-enabled=true
	discdb.sync-emptyjsondbonstart=false
	discdb.url=http://localhost/darwino.sync
	discdb.instances=disc.nsf

