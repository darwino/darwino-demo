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
