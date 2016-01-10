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
 * Sample Renderkit
 */

(function(angular) {
	
	angular.module("darwino")
		.service("dwoTreeRenderer", ['darwino','$compile',function(darwino,$compile) {
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
    					if(this.hasTransclude) {
    						return tmplTrans || (tmplTrans=$compile(template(true)));
    					} else {
    						return tmplStd || (tmplStd = $compile(template(false)));
    					}
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
	                    if(this.getLevel()>1) {
	                    	c = darwino.concatClasses(c,"indent");
	                    }
						return c;
					};
					scope.treeToggleClass = function() {
						if(this.isLeaf()) {
							return "tree-toggle-leaf dwo-tree-icon";
						}
						return this.isExpanded() ? "tree-toggle-expanded dwo-tree-icon" : "tree-toggle-collapsed dwo-tree-icon";
					};
					scope.treeIconClass = function() { 
						var icon = this.node.iconClass;
						if(this.isLeaf()) {
							return (icon||"tree-leaf");
						}
						return this.isExpanded() ? (icon||"tree-branch-expanded")+" dwo-tree-icon" : (icon||"tree-branch-collapsed")+" dwo-tree-icon";
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
	}]);
	
})(angular);
