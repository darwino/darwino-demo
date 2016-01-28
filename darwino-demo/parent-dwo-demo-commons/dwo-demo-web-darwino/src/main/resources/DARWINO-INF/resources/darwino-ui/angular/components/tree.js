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
	            controller: [ '$scope','$transclude','$injector', function($scope,$transclude,$injector) {
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
                }],
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
