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
