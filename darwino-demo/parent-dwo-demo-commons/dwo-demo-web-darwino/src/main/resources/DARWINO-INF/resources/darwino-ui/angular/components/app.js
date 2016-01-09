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

/*
 * Application Layout
 * 
 * An application is made of a stacked set of horizontal components
 *  1- Master Header
 *  	Application specific, like a common banner, daily messages...
 * 	2- Header (Banner)
 * 		[Branding] [Global Navigation] [User & Help links]
 *  3- Title bar
 *  	[Title] [Action Bar] [Search]
 *  4- Body
 *  	Generally made of multiple columns
 *  	[Left Navigation+Filters] [Content] [Optional right column]
 *  5- Footer
 *  	List of list and legal text
 *  6- Master Header
 *  	Application specific
 */
(function ( angular ) {
    'use strict';

    angular.module( 'dwoAppLayout', [] )
        .directive( 'dwoAppLayout', ['$compile', 'dwoAppLayoutRenderer', function( $compile, dwoAppLayoutRenderer ) {
        	return {
                restrict: 'E',
                transclude: true,
        		scope: {
        			// MASTER HEADER
        			// Master header - facet='mastheader' (always a facet)
        			masterHeader:			'@',	// boolean

        			// HEADER
        			// Header bar - facet='header'
        			header:					'@',	// boolean
        			// Branding - facet='headerBranding'
        			brandingLabel:			'@',	// Text
        			brandingImage:			'@',	// Text
        			brandingClass:			'@',	// Text
        			// User help & login - facet='headerNavigation'
        			globalNavigation:		'@',	// Tree
        			// User help & login - facet='headerUser'
        			user:					'@',	// Tree
        			
        			// TITLE BAR
        			// Application title - facet='title'
        			titleLabel:				'@',	
        			titleImage:				'@',	
        			titleClass:				'@',
        			// Application actions - facet='actions'
        			actions:				'@',
        			// Search bar - facet='search'
        			search:					'@',
        			
        			// BODY
        			// Left column - facet='left'
        			leftMenu:				'@', 
        			// Right column - facet='right' (always a facet)
        			// Content - facet='content' (always a facet)
        			
        			// FOOTER
        			// Footer - facet='footer'
        			footer:					'@',
        			
        			// MASTER FOOTER
        			// Master footer - facet='mastfooter' (always a facet)
            		masterFooter:			'@'
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
    }]);
    
})( angular );