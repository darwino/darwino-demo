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
 * Bootstrap Renderkit
 */

(function(angular) {
	
	angular.module("darwino")
		.service("dwoTreeCompositeRenderer", ['darwino','dwoTreeRenderer','dwoTreeListRenderer',function(darwino,dwoTreeRenderer,dwoTreeListRenderer) {
			return {
				// Give it a chance to get initialized
				initScope: function(scope) {
					dwoTreeRenderer.initScope(scope); var treeTemplate = scope.nodeTemplate;
					dwoTreeListRenderer.initScope(scope); var listTemplate = scope.nodeTemplate;
					
    				scope.nodeTemplate = function() {
    					if(this.getLevel()==0) {
    						return listTemplate.call(this);
    					} else {
    						return treeTemplate.call(this);
    					}
    				};
    				
    				scope.li
				}
			};
	}]);
	
})(angular);
