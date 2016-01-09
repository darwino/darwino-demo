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

/**
  Bootstrap Renderkit
 */

(function(angular) {
	
	angular.module("darwino")
		.service("dwoTreeRenderer", function() {
			return {
				leafClass	:		function() { return "tree-leaf"; },
				expandedClass:		function() { return "tree-expanded"; },
				collapsedClass:		function() { return "tree-collapsed"; },
			};
	});
	
})(angular);
