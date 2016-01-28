/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2016.
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
