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
		.service("dwoTreeChevronRenderer", ['darwino','dwoTreeRenderer',function(darwino,dwoTreeRenderer) {
			return {
				initScope: function(scope) {
					dwoTreeRenderer.initScope(scope);
					
					scope.treeToggleClass = function() { 
						if(this.isLeaf()) {
							return "glyphicon dwo-tree-icon";
						}
						return this.isExpanded() ? "glyphicon glyphicon-chevron-down tree-toggle-expanded dwo-tree-icon" : "glyphicon glyphicon-chevron-right tree-toggle-collapsed dwo-tree-icon";
					};
				}
			};
	}]);
	
})(angular);
