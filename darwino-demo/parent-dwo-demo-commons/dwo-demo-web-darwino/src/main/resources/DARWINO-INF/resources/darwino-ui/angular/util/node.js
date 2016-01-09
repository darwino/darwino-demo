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
