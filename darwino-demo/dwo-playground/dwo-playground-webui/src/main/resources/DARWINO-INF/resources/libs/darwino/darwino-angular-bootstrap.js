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
 * Main module creation.
 * This must be the first file loaded in the page
 */
(function(angular) {
	
	angular.module("darwino", [])
		.service("darwino", function() {
			var nativeFilter = Array.prototype.filter;

        	function concat(c,sep) {
        		// Cannot use join() because of possible empty array values
        		// forEach() is not yet available on all browsers (ex: IE8)
        		var s = "";
        		for(var i=0; i<c.length; i++) {
        			if(c[i]) {
        				if(s) s += sep + c[i]; else s = c[i];
        			}
    			}
        		return s;
        	}
			
			return {
				// Get the version of Darwino
				version: function() { 
					return "1.0.0"; 
				},
				
				// String utilities
				trim: (function() {
					  if (!String.prototype.trim) {
					    return function(value) {
					      return value.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
					    };
					  }
					  return function(value) {
					    return value.toString().trim();
					  };
				})(),
				
				// Style and class handling
            	concatClasses: function(c) {
            		return concat(arguments," ");
            	},
            	concatStyles: function(s) {
            		return concat(arguments,";");
            	},
            	addClass: function(cssClass, addClassProperty) {
            		if (cssClass) {
            			if (addClassProperty)
            				return 'class="' + cssClass + '"';
            			else
            				return cssClass;
            		}
            		else
            			return "";
            	},
				
				// Set a default value for a property, if not already defined
            	setDefaultProperty: function(obj, prop, value) {
	                if (!obj.hasOwnProperty(prop)) {
	                    obj[prop] = value;
	                }
	            }
			};
	});
	
}(angular));

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

// TreeNodes
//
//	NodeProvider
//		Node[] createNodes()
//
//	Node
//		id
//		label
//		type
//		icon
//		style
//		class
//		children
//		onclick
//		ondblclick

/* 
 * 1- Creating a static tree
 *	[
 *		{
 *			id: 		'node1',
 *			label:		'Node #1',
 *			children: [
 *				{
 *					id: 		'node1.1',
 *					label:		'Node #1.1',
 *				},
 *				{
 *					id: 		'node1.2',
 *					label:		'Node #1.2',
 *				},
 *			]
 *		} 		
 *	]
 *
 * 2- Creating a dynamic tree
 *	function () {
 *		return <a children array>;
 *	}
 * 
 * 3- Creating a dynamic tree with static title
 *	[
 *		{
 *			id: 		'node1',
 *			label:		'Node #1',
 *			children: 	function() { return <the children of the node 1>; }
 *		}, 		
 *		{
 *			id: 		'node2',
 *			label:		'Node #2',
 *			children: 	function() { return <the children of the node 2>; }
 *		}, 		
 *	]
 */

/**
 * Tree node utilities.
 */
(function(angular) {

	// Default factory implementation
	function NodeAccessor() {
	}		
	NodeAccessor.prototype.getId = function(node)  {
		return node.Id;
	}
	NodeAccessor.prototype.isLeaf = function(node)  {
		var c = this.getChildren(node);
		return c==null || c.length==0;
	}
	NodeAccessor.prototype.getLabel = function(node)  {
		return node.label;
	}
	NodeAccessor.prototype.getBranchClass = function(node)  {
		return null;
	}
	NodeAccessor.prototype.getLeafClass = function(node)  {
		return null;
	}
	NodeAccessor.prototype.getLabelClass = function(node)  {
		return null;
	}
	NodeAccessor.prototype.getSelectedClass = function(node)  {
		return null;
	}
	NodeAccessor.prototype.getChildren = function(node)  {
		if(angular.isFunction(node.children)) {
			return node.children();
		}
		return node.children;
	}
	var DEF_ACCESSOR = new NodeAccessor();
	
	angular.module("darwino")
		.service("dwoNodeAccessorFactory", function() {
			return {
				defaultAccessor: function() {
					return DEF_ACCESSOR; 
				},
				createAccessor: function() {
					return new NodeAccessor(); 
				},
				getAccessor: function(node,opt) {
					return node.nodeAccessor  || (opt && opt.nodeAccessor) || DEF_ACCESSOR;
				}
			};
	});
	
}(angular));

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
 * Tree control.
 * Based on http://ngmodules.org/modules/angular-tree-control
 */
(function ( angular ) {
    'use strict';
    
    angular.module( 'darwino' )
        .directive( 'dwoTree', ['$compile', 'darwino', 'dwoNodeAccessorFactory', 'dwoTreeRenderer', function( $compile, darwino, dwoNodeAccessorFactory, dwoTreeRenderer ) {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    treeModel: "=",
                    selectedNode: "=?",
                    onSelection: "&",
                    options: "=?"
                },
                controller: function($scope,$transclude,$injector) {
                    var options = $scope.options = $scope.options || {};
                    darwino.setDefaultProperty(options, "dirSelectable", true);

                    // Use a custom renderer if passed as a parameter
                    if(options.renderer) {
                    	dwoTreeRenderer = $injector.get(options.renderer);
                    } 
                    if(options.nodeAccessorFactory) {
                    	dwoNodeAccessorFactory = options.nodeAccessorFactory;
                    }
                    
                    // -----------------------------------------------------------------------------------------------------------
                    // Rendering methods
                    // All the methods bellow are used to render the tree. They are all added to the tree scope, and thus
                    // child scopes (one per node actually) will prototypically inherit from them. When they are called, 'this'
                    // is the scope of the node being processed. So the methods body can access:
                    //		- this : the scope of the node
                    //		- this.node : the node itself
                    //		- this.options : the global options set to the tree
                    //		- $scope is the tree scope
                    //
                    // Note #1
                    // 		http://stackoverflow.com/questions/11605917/this-vs-scope-in-angularjs-controllers
                    // 	The ng-repeat creates a new scope that is then used by the functions inside it. As such, the function might not have 
    				//  a parameter and access this.node instead. So 'this' is the scope. and this.node is the corresponding node
                    //
                    // Note #2
                    //		http://docs.angularjs.org/api/ng/directive/ngRepeat
                    //	The ng-repeat automatically adds a $$hashKey to each item (here node) that it processes. This is what is used 
    				//	to uniquely identify every single node. We can use this to identify the node, or instead use the scope $id as
    				//  there is one scope per node.
                    // -----------------------------------------------------------------------------------------------------------
                    
                    $scope.expandedNodes = {};
                    
                    $scope.nodeAccessor = function() {
                    	return dwoNodeAccessorFactory.getAccessor(this.node,options);
                    }

                    $scope.nodeId = function() {
                    	return this.$id; //this.node.$$hashKey;
                    };

                    $scope.children = function() {
                        return $scope.nodeAccessor().getChildren(this.node);
                    };

                    $scope.isExpanded = function() {
                        return !!$scope.expandedNodes[this.nodeId()];
                    };

                    $scope.isSelected = function() {
                    	// $scope here is the main tree scope while 'this' is the node scope
                        return this.node == $scope.selectedNode;
                    };

                    $scope.isLeaf = function() {
                        return this.nodeAccessor().isLeaf(this.node);
                    };

                    $scope.getLevel = function() {
                    	var level = 0;
                    	for(var s=this; s && s!=$scope; s=s.$parent) {
                    		level++;
                    	}
                    	return level;
                    };
                    
                    $scope.getParent = function() {
                    	if(this.$$parent==$scope) {
                    		return null;
                    	}
                    	return this.$$parent;
                    };

                    $scope.selectNodeHead = function() {
                    	if(!this.isLeaf()) {
                    		// Remove the selection
                    		// Should do that uniquely if the node is becoming hidden, but how to know that?
                            $scope.selectedNode = undefined;
                            if ($scope.onSelection) {
                                $scope.onSelection({node: null});
                            }
                    		$scope.expandedNodes[this.nodeId()] = ($scope.expandedNodes[this.nodeId()] === undefined ? this.node : undefined);
                    	}
                    };
                    
                    $scope.selectNodeLabel = function(){
                    	// $scope here is the main tree scope while 'this' is the node scope
                        if (!this.isLeaf() && !$scope.options.dirSelectable) {
                            this.selectNodeHead();
                        } else {
                            $scope.selectedNode = this.node;
                            if ($scope.onSelection) {
                                $scope.onSelection({node: this.node});
                            }
                        }
                    };

                    $scope.nodeLabel = function() {
                        return this.nodeAccessor().getLabel(this.node);
                    };
                    
    				$scope.nodeTemplate = function(hasTransclude) {
    					// This must be implemented by a renderer
    					throw new Error();
    				};
                    

                    // Let the renderkit override the rendering methods
                	if(dwoTreeRenderer.initScope) {
                		dwoTreeRenderer.initScope($scope);
                	}
                	
                    // As well as the options, to give it a customization opportunity
                	if(options.initScope) {
                		options.initScope($scope);
                	}

                	// Check if there is a transclude associated to the nodes so we can build an optimized template
            		$transclude(function(clone) {
                		$scope.hasTransclude = !!darwino.trim(clone.text());
                	});
                	
                    return {};
                },
                compile: function(element, attrs, childTranscludeFn) {
                    return function ( scope, element, attrs, treemodelCntr ) {
                    	// Watch the tree model and set the root nodes if it changed
                    	// The root can be either a node, or an array. In case of a node, then
                    	// an array is created
                        scope.$watch("treeModel", function updateNodeOnRootScope(newValue) {
                            if (angular.isDefined(scope.node) ) {
                            	var children = scope.node.children;
                            	if (angular.isArray(newValue)) {
                                	if(angular.equals(children, newValue)) {
                                        return;
                                	}
                            	} else {
                                	if(children.length==1 && angular.equals(children[0], newValue)) {
                                        return;
                                	}
                            	}
                            }
                            scope.node = {};
                            scope.node.children = angular.isArray(newValue) ? newValue : [newValue];
                        });

                        //Rendering template for a root node
                        scope.nodeTemplate()(scope, function(clone) {
                        	element.empty();
                        	element.append(clone);
                        });
                        
                        // save the transclude function from compile (which is not bound to a scope as opposed to the one from link)
                        // we can fix this to work with the link transclude function with angular 1.2.6. as for angular 1.2.0 we need
                        // to keep using the compile function
                        scope.$treeTransclude = childTranscludeFn;
                    }
                }
            };
        }])
        .directive("dwoTreeItem", function() {
            return {
                restrict: 'E',
                require: "^dwoTree",
                link: function( scope, element, attrs, treemodelCntr) {
                    // Rendering template for the current node
                	scope.nodeTemplate()(scope, function(clone) {
                    	element.empty();
                    	element.append(clone);
                    });
                }
            }
        })
        .directive("dwoTreeTransclude", function() {
            return {
                link: function(scope, element, attrs, controller) {
                    scope.$treeTransclude(scope, function(clone) {
                    	element.empty();
                    	element.append(clone);
                    });
                }
            }
        });
})( angular );

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

