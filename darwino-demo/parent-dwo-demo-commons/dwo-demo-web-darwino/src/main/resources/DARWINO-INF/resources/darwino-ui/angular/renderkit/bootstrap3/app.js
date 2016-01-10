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
		.service("dwoAppLayoutRenderer", function() {
			// HTML template used by a node
			var tmplStd, tmplTrans;
			function template(hasTransclude) {
				return '<ul ng-class="treeUlClass()">' +
                    '<li ng-repeat="node in children()" ng-class="treeLiClass()">' +
                      '<i ng-class="treeToggleClass()" ng-click="selectNodeHead()"></i>' +
                      '<i ng-class="treeIconClass()""></i>' +
                      '<div ng-class="treeNodeClass()" ng-click="selectNodeLabel()">'+(hasTransclude?'<span dwo-tree-transclude></span></div>':'<span>{{nodeLabel()}}</span></div>') +
                      '<dwo-tree-item ng-if="isExpanded()"></dwo-tree-item>' +
                    '</li>' +
                   '</ul>';
			}
			return {
				// Give it a chance to get initialized
				initScope: function(scope) {
    				scope.nodeTemplate = function() {
    					
    				};
					// Support methods that can be overridden
                    scope.treeUlClass = function() {
                        return "";
                    };
					scope.treeLiClass = function() { 
	                    var c = null;
	                    if (this.isLeaf()) {
	                    	c = "tree-leaf";
	                	} else {
	                    	c = "tree-branch";
	                	}
	                    if (this.isExpanded()) {
	                    	c = darwino.concatClasses(c,"tree-expanded");
	                    } else {
	                    	c = darwino.concatClasses(c,"tree-collapsed");
	                    }
						return c;
					};
					scope.treeToggleClass = function() {
						if(this.isLeaf()) {
							return "tree-toggle-leaf";
						}
						return this.isExpanded() ? "tree-toggle-expanded" : "tree-toggle-collapsed";
					};
					scope.treeIconClass = function() { 
						if(this.isLeaf()) {
							return "tree-leaf";
						}
						return this.isExpanded() ? "tree-branch-expanded" : "tree-branch-collapsed";
					};
                    scope.treeNodeClass = function() {
                    	var labelClass = this.treeLabelClass();
                        if (this.isSelected()) {
                        	labelClass = darwino.concatClasses(labelClass,this.treeSelectedClass());
                        }
                        return labelClass;
                    };
					scope.treeLabelClass = function() { 
						return darwino.concatClasses(
								"tree-label",
								this.nodeAccessor().getLabelClass(this.node)); 
					};
					scope.treeSelectedClass = function() { 
						return darwino.concatClasses(
								"tree-selected",
								this.nodeAccessor().getSelectedClass(this.node));
					}
				}
			}
	});
	
})(angular);
