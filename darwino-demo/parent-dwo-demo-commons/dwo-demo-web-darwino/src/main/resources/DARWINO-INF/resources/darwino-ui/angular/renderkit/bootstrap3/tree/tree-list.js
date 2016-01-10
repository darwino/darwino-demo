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
