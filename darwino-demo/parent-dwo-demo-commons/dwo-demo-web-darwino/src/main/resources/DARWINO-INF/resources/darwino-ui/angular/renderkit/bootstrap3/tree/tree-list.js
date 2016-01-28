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
		.service("dwoTreeListRenderer", ['darwino','$compile',function(darwino,$compile) {
			// HTML template used by a node
			var tmplStd, tmplTrans;
			function template(hasTransclude) {
                return '<ul ng-class="listUlClass()">' +
                	'<li ng-repeat="node in children()" ng-class="listLiClass()" style="padding-left: 20px">' +
                		'<i ng-class="listToggleClass()" ng-click="selectNodeHead()"></i>' +
                        '<i ng-class="listIconClass()""></i>' +
                		'<span ng-class="listNodeClass()" ng-click="selectNodeLabel()">'+(hasTransclude?'<span dwo-tree-transclude></span></div>':'<span>{{nodeLabel()}}</span></span>') +
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
                    scope.listUlClass = function() {
                    	return "list-group";
                    };
					scope.listLiClass = function() { 
                    	return "list-group-item";
					};
					scope.listToggleClass = function() { 
						if(this.isLeaf()) {
							return "glyphicon dwo-tree-icon";
						}
						return this.isExpanded() ? "glyphicon glyphicon-minus tree-toggle-expanded dwo-tree-icon" : "glyphicon glyphicon-plus tree-toggle-collapsed dwo-tree-icon";
					};
					scope.listIconClass = function() {
						if(this.isLeaf()) {
							return "glyphicon glyphicon-file tree-leaf dwo-tree-icon";
						}
						return this.isExpanded() ? "glyphicon glyphicon-folder-open tree-branch-expanded dwo-tree-icon" : "glyphicon glyphicon-folder-close tree-branch-collapsed dwo-tree-icon";
					};
					
                    scope.listNodeClass = function() {
                    	var labelClass = this.listLabelClass();
                        if (this.isSelected()) {
                        	labelClass = darwino.concatClasses(labelClass,this.listSelectedClass());
                        }
                        return labelClass;
                    };
					scope.listLabelClass = function() { 
						return darwino.concatClasses(
								"tree-label",
								this.nodeAccessor().getLabelClass(this.node)); 
					};
					scope.listSelectedClass = function() { 
						return darwino.concatClasses(
								"tree-selected",
								this.nodeAccessor().getSelectedClass(this.node));
					};
				}
			};
	}]);
	
})(angular);
