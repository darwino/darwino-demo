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
 * Bootstrap Renderkit
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
                		'<span ng-class="treeNodeClass()" ng-click="selectNodeLabel()">'+(hasTransclude?'<span dwo-tree-transclude></span></div>':'<span>{{nodeLabel()}}</span></span>') +
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
					// Classes to be used
                    scope.treeUlClass = function() {
                    	return "nav nav-pills nav-stacked";
                    };
					scope.treeLiClass = function() {
                    	return this.getLevel()>1 ? "indent": "";
					};
					scope.treeToggleClass = function() { 
						if(this.isLeaf()) {
							return "glyphicon dwo-tree-icon";
						}
						return this.isExpanded() ? "glyphicon glyphicon-minus tree-toggle-expanded dwo-tree-icon" : "glyphicon glyphicon-plus tree-toggle-collapsed dwo-tree-icon";
					};
					scope.treeIconClass = function() {
						var icon = this.node.iconClass;
						if(this.isLeaf()) {
							return (icon||"glyphicon glyphicon-file")+" tree-leaf dwo-tree-icon";
						}
						return this.isExpanded() ? (icon||"glyphicon glyphicon-folder-open")+" tree-branch-expanded dwo-tree-icon" : (icon||"glyphicon glyphicon-folder-close")+" tree-branch-collapsed dwo-tree-icon";
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
					};
				}
			};
	}]);
	
})(angular);
