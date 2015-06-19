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
 * Darwino main JS file.
 * 
 * This file must be loaded *before* any other file. It will then be used by the modules
 * to declare/define themselves.
 * 
 * Note that the actual implementation of the darwino.js file may changed if an external
 * loader is to be used.
 * 
 */
if(typeof darwino==="undefined") {
	darwino = {
		__modules: {},
		version: "1.0.0",	// Get that from the build.
		provide: function(name,dep,fct) {
			if(!this.__modules[name]) {
				this.__modules[name] = fct.call() || true;
			}
		},
		install: function(name,o) {
			var m = darwino[name] = darwino[name] || {};
			if(o) {
				for(var k in o) {
					m[k] = o[k]; 
				}
			}
			return m;
		}
	};
}
;
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

darwino.provide("darwino/HtmlUtils",null,function() {
	darwino.install("Utils", {
		//
		// Node access
		//
		byId: function(id) {
			return this.isString(id) ? document.getElementById(id) : id;		
		},
		
		//
		// DOM utils
		//
		removeChildren: function(e) {
			e = this.byId(e);
			if(e) {
				while(e.firstChild) {
				    e.removeChild(e.firstChild);
				}
			}
		},
		setText: function(e,text) {
			e = this.byId(e);
			if(e) {
				this.removeChildren(e);
				var args = Array.prototype.slice.call(arguments, 1);
				var textNode = document.createTextNode(this.format.apply(this,args));
				e.appendChild(textNode);
			}
		}
	});
});

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

darwino.provide("darwino/Logger",null,function() {
	darwino.install("log", {
		//
		// Logger - Level values are from Java
		//
		logLevels: 	{},
	    NONEL:		0x7fffffff,
	    ERROR:		1000,
	    WARN:		900,
	    INFO:		800,
	    DEBUG:		300,
		_print: function(s) {
			return console.log(s);
		},
		print: function(s /*, varargs*/) {
			return this._print(darwino.Utils.format.apply(null,Array.prototype.slice.call(arguments,0)));
		},
		logException: function(e) {
			return this._print(e.toString());
		},
		e: function(group,msg) {
			if(this.logLevels[group]>=this.ERROR) {
				return this.print("[ERROR "+group+"] "+darwino.Utils.format.apply(null,Array.prototype.slice.call(arguments,1)));
			}
		},
		w: function(group,msg) {
			if(this.logLevels[group]>=this.WARN) {
				return this.print("[WARN "+group+"] "+darwino.Utils.format.apply(null,Array.prototype.slice.call(arguments,1)));
			}
		},
		i: function(group,msg) {
			if(this.logLevels[group]>=this.INFO) {
				return this.print("[INFO "+group+"] "+darwino.Utils.format.apply(null,Array.prototype.slice.call(arguments,1)));
			}
		},
		d: function(group,msg) {
			if(this.logLevels[group]>=this.DEBUG) {
				return this._print("[DEBUG "+group+"]"+darwino.Utils.format.apply(null,Array.prototype.slice.call(arguments,1)));
			}
		},
		isLogEnabled: function(group,level) {
			return this.logLevels[group]>=level; 
		},
		enable: function(group,level) {
			this.logLevels[group]=level; 
		}
	});
	
	// Debug shortcuts
	darwino.print = function() {darwino.log.print.apply(darwino.log,arguments)};
});

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

darwino.provide("darwino/Utils",null,function() {
	darwino.install("Utils", {
			
		//
		// Type checking
		//
		isString: function(v) {
			return v && (typeof v=="string" || v instanceof String);
		},
		isObject: function(v) {
			return v && (typeof v=="object" || v instanceof Object);
		},
		isArray: function(v) {
			return v && (typeof v=="array" || v instanceof Array);
		},
		isNumber: function(v) {
			return v && (typeof v=="number" || v instanceof Number);
		},
		isBoolean: function(v) {
			return v && (typeof v=="boolean" || v instanceof Boolean);
		},
		isDate: function(v) {
			return v && (v instanceof Date);
		},
		
		//
		// Handling paths
		//
		concatPath: function(/*paths*/) {
			var s = arguments[0];
			for(var i=1; i<arguments.length; i++ ) {
				s = this.removeTrailingSep(s)+'/'+this.removeLeadingSep(arguments[i]); 
			}
			return s;
		},
		addTrailingSep: function(p) {
			return this.endsWith(p,'/') ? p : p+'/';
		},
		removeTrailingSep: function(p) {
			return this.endsWith(p,'/') ? this.left(p,-1) : p;
		},
		addLeadingSep: function(p) {
			return this.startsWith(p,'/') ? p : '/'+p;
		},
		removeLeadingSep: function(p) {
			return this.startsWith(p,'/') ? p.substring(1) : p;
		},
		
		//
		// Handling JSON
		//
		toJson: function(value,compact) {
			return compact ? JSON.stringify(value) : JSON.stringify(value,null,4);
		},
		fromJson: function(json) {
			// Makes JSON more permissive (ex: {a:"A"} instead of {"a":"A"}
			//return JSON.parse(json)
			return eval("(" + json + ")");
		},
		jsonPath: 	null,		// See support libs

		
		//
		// Object utilities
		//
		isEmptyObject: function(o) {
			if(o) {
				for(var n in o) {
					return false;
				}
			}
			return true;
		},		
		
		//
		// String utilities
		//
		left: function(s,length) {
			if(length<0) length=s.length+length;
			return s.substring(0,Math.min(length,s.length));
		},
		startsWith: function(s,prefix) {
			return s.length>=prefix.length && s.substring(0,prefix.length)==prefix;
		},
		startsWithIgnoreCase: function(s,prefix) {
			return s.length>=prefix.length && s.substring(0,prefix.length).toLowerCase()==prefix.toLowerCase();
		},
		endsWith: function(s,suffix) {
			return s.length>=suffix.length && s.substring(s.length-suffix.length)==suffix;
		},
		endsWithIgnoreCase: function(s,suffix) {
			return s.length>=suffix.length && s.substring(s.length-suffix.length).toLowerCase()==suffix.toLowerCase();
		},
		equals: function (s1,s2) {
			if(!s1) return !s2;
			if(!s2) return false;
			return s1==s2;
		},
		equalsIgnoreCase: function (s1,s2) {
			if(!s1) return !s2;
			if(!s2) return false;
			return s1.toLowerCase()==s2.toLowerCase();
		},
		uuid: function() {
			// Keep the UUID 32 characters to handle some replicated system with only 32 ch (ex: FlowBuilder)
			//var tmpl = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
			var tmpl = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
			return tmpl.replace(/[xy]/g, function(c) {
			    var r = Math.random()*16|0;
			    var v = c == 'x' ? r : (r&0x3|0x8);
			    return v.toString(16).toUpperCase(); // Make sure it is upper case as UNID should be like this
			});	
		},
		format: function(msg) {
			for(var i=1; i<arguments.length; i++) {
				msg = (msg || "").replace("{"+(i-1)+"}",arguments[i]);
			}
			return msg;
		},
	    toUtf8: function (argString) {
    	  // From: http://phpjs.org/functions
    	  // + original by: Webtoolkit.info (http://www.webtoolkit.info/)
    	  // + improved by: Kevin van Zonneveld
			// (http://kevin.vanzonneveld.net)
    	  // + improved by: sowberry
    	  // + tweaked by: Jack
    	  // + bugfixed by: Onno Marsman
    	  // + improved by: Yves Sucaet
    	  // + bugfixed by: Onno Marsman
    	  // + bugfixed by: Ulrich
    	  // + bugfixed by: Rafal Kukawski
    	  // + improved by: kirilloid
    	  // + bugfixed by: kirilloid
    	  // * example 1: utf8_encode('Kevin van Zonneveld');
    	  // * returns 1: 'Kevin van Zonneveld'

    	  if (argString === null || typeof argString === "undefined") {
    	    return "";
    	  }

    	  var string = (argString + ''); // .replace(/\r\n/g,
											// "\n").replace(/\r/g, "\n");
    	  var utftext = '',
    	    start, end, stringl = 0;

    	  start = end = 0;
    	  stringl = string.length;
    	  for (var n = 0; n < stringl; n++) {
    	    var c1 = string.charCodeAt(n);
    	    var enc = null;

    	    if (c1 < 128) {
    	      end++;
    	    } else if (c1 > 127 && c1 < 2048) {
    	      enc = String.fromCharCode(
    	         (c1 >> 6)        | 192,
    	        ( c1        & 63) | 128
    	      );
    	    } else if (c1 & 0xF800 != 0xD800) {
    	      enc = String.fromCharCode(
    	         (c1 >> 12)       | 224,
    	        ((c1 >> 6)  & 63) | 128,
    	        ( c1        & 63) | 128
    	      );
    	    } else { // surrogate pairs
    	      if (c1 & 0xFC00 != 0xD800) { throw new RangeError("Unmatched trail surrogate at " + n); }
    	      var c2 = string.charCodeAt(++n);
    	      if (c2 & 0xFC00 != 0xDC00) { throw new RangeError("Unmatched lead surrogate at " + (n-1)); }
    	      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
    	      enc = String.fromCharCode(
    	         (c1 >> 18)       | 240,
    	        ((c1 >> 12) & 63) | 128,
    	        ((c1 >> 6)  & 63) | 128,
    	        ( c1        & 63) | 128
    	      );
    	    }
    	    if (enc !== null) {
    	      if (end > start) {
    	        utftext += string.slice(start, end);
    	      }
    	      utftext += enc;
    	      start = end = n + 1;
    	    }
    	  }

    	  if (end > start) {
    	    utftext += string.slice(start, stringl);
    	  }

    	  return utftext;
    	},
	    fromUtf8: function (str_data) {
    	  // From: http://phpjs.org/functions
    	  // + original by: Webtoolkit.info (http://www.webtoolkit.info/)
    	  // + input by: Aman Gupta
    	  // + improved by: Kevin van Zonneveld
			// (http://kevin.vanzonneveld.net)
    	  // + improved by: Norman "zEh" Fuchs
    	  // + bugfixed by: hitwork
    	  // + bugfixed by: Onno Marsman
    	  // + input by: Brett Zamir (http://brett-zamir.me)
    	  // + bugfixed by: Kevin van Zonneveld
			// (http://kevin.vanzonneveld.net)
    	  // + bugfixed by: kirilloid
    	  // * example 1: utf8_decode('Kevin van Zonneveld');
    	  // * returns 1: 'Kevin van Zonneveld'

    	  var tmp_arr = [],
    	    i = 0,
    	    ac = 0,
    	    c1 = 0,
    	    c2 = 0,
    	    c3 = 0,
    	    c4 = 0;

    	  str_data += '';

    	  while (i < str_data.length) {
    	    c1 = str_data.charCodeAt(i);
    	    if (c1 <= 191) {
    	      tmp_arr[ac++] = String.fromCharCode(c1);
    	      i++;
    	    } else if (c1 <= 223) {
    	      c2 = str_data.charCodeAt(i + 1);
    	      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
    	      i += 2;
    	    } else if (c1 <= 239) {
    	      // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
    	      c2 = str_data.charCodeAt(i + 1);
    	      c3 = str_data.charCodeAt(i + 2);
    	      tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
    	      i += 3;
    	    } else {
    	      c2 = str_data.charCodeAt(i + 1);
    	      c3 = str_data.charCodeAt(i + 2);
    	      c4 = str_data.charCodeAt(i + 3);
    	      c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
    	      c1 -= 0x10000;
    	      tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1>>10) & 0x3FF));
    	      tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
    	      i += 4;
    	    }
    	  }

    	  return tmp_arr.join('');
    	},
    	
    	//
    	// XML Utilities
    	//
		parseXml: function(xml) {
			var xmlDoc=null;
			try {
				if(!document.evaluate){
					xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
					xmlDoc.async="false";
					xmlDoc.loadXML(xml);
				}else{
					if(window.DOMParser){
						parser=new DOMParser();
						xmlDoc=parser.parseFromString(xml,"text/xml");
					}
				}
			}catch(ex){
				xmlDoc = undefined;
			}
			return xmlDoc;
		},
		xmlString: function(xmlDoc) {
			if (!xmlDoc) {
				return "";
			} else if(window.ActiveXObject){
				return xmlDoc.xml;
			} else {
				return (new XMLSerializer()).serializeToString(xmlDoc);
			}
		},
	    
		//
		// Date Utilities
		//
		dateToString: function(d) {
			// always 24 characters long: YYYY-MM-DDTHH:mm:ss.sssZ. The timezone is always zero UTC offset, as denoted by the suffix "Z".
			return d ? d.toISOString() : null;
		},
		stringToDate: function(date) {
			// Test here: https://regex101.com/
          	var regexp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{1,3})?(Z|(?:[+-](\d{2}):(\d{2})))?$/g;
          	var match = regexp.exec(date);
            if(!match) return null
		        
		    var year = parseInt(match[1]);
		    var month = parseInt(match[2]);
		    var day = parseInt(match[3]);
		    var hour = parseInt(match[4]);
		    var minutes = parseInt(match[5]);
		    var seconds = parseInt(match[6]);
            var milliseconds = match[7] ? parseInt(match[7].substring(1)) : 0;
		    // timezone
		    // it is supposed to be mandatory, at least 'Z', but if missing we assume 'Z'
		    // In JS, we only support 'Z' and +/-HH:MM
		    var tzOffset=0;
		    if(match.length>8 && match[8]) {
		        var timezoneIndicator = match[8].charAt(0);
		        if((timezoneIndicator == '+' || timezoneIndicator == '-')) {
		            var tzh = parseInt(match[9]);
		            var tzm =parseInt(match[10]);
		    		tzOffset = (tzh*60*60*1000 + tzm*60*1000);
		          	if(timezoneIndicator == '+') tzOffset = -tzOffset;
		        //} else if (timezoneIndicator == 'Z') {
		        //    // already UTC...
		        }
		    }

		    var dt = Date.UTC(year,month-1,day,hour,minutes,seconds,milliseconds);
		    return new Date(dt+tzOffset);
		},

		//
		// Base64
		//
		atob:	null,	// window.atob; 
		btoa:	null,	// window.btoa; 
		
		//
		// Create a Promise
		//
		promise: null,	// See support library
		
		//
		// Misc utilities
		//
		now: function() {
			return (new Date()).getTime();
		},		
		intAsString: function(l) {
			return l.toFixed();
		}
		
	});
});

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

darwino.provide("darwino/jstore/exception",null,function() {

	var jstore = darwino.install("jstore");
	
	function Exception(msg) {
		this._msg = (msg || "").replace("{0}",arguments[1])
							   .replace("{1}",arguments[2])
							   .replace("{2}",arguments[3])
							   .replace("{3}",arguments[4])
							   .replace("{4}",arguments[5])
							   .replace("{5}",arguments[6])
							   .replace("{6}",arguments[7])
							   .replace("{7}",arguments[8])
							   .replace("{8}",arguments[9])
							   .replace("{9}",arguments[10]);
	}
	
	Exception.prototype.toString = function() {
		return this._msg;
	};
	
	jstore.JsonException = jstore.JsonDBException = Exception;
});

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

darwino.provide("darwino/jstore/jstore",null,function() {

	var jstore = darwino.install("jstore");

	jstore.Attachment = {
		OP_NOOP:		0,
		OP_CREATED:		1,
		OP_UPDATED:		2,
		OP_DELETED:		3
	};

	jstore.Cursor = {
		HIERARCHY_FLAT:		0,
		HIERARCHY_ONE:		1,
		HIERARCHY_ALL:		99999,
	
		// Data related flags
		DATA_VALUE:			0x0010,
		DATA_DOCUMENT:		0x0020,
		DATA_NONE:			0x0040,
		DATA_MODDATES:		0x0080,
	
		DATA_READMARK:		0x0100,	
		DATA_WRITEACC:		0x0200,	
	
		// Options flags
		HIERARCHY_NOSQL:	0x1000,
		QUERY_NOSQL:		0x4000,
		RANGE_ROOT:			0x8000,
		TAGS_OR:			0x10000,

		// Value passed as a NULL parent id
		NULL_PARENT:		"",

		// Value used to separate an index name from the store name, for responses
		INDEX_STORE_SEP:	':'
	};

	jstore.CursorEntry = {
	};
	jstore.Database = {
		STORE_DEFAULT:		"_default",	
		STORE_LOCAL:		"_local",
		STORE_COMMENTS:		"_comments",
		STORE_DESIGN:		"_design",
			
		DOCSEC_NONE:		0x0000,
		DOCSEC_INCLUDE:		0x0001,
		DOCSEC_EXCLUDE:		0x0002,
		DOCSEC_ALL:			0x0004
	};

	jstore.Document = {
		SAVE_NOREAD:				1,
		
		JSON_DOCUMENT:				1,
		JSON_ALLATTACHMENTS:		2,
		JSON_UPDATEDATTACHMENTS:	4,
		JSON_ATTACHMENTCONTENT:		8,
		JSON_ATTACHMENTURL:			16,
		
		SYSTEM_PREFIX: 				"_",
		SYSTEM_READERS:				"_readers",
		SYSTEM_WRITERS:				"_writers",
		SYSTEM_EREADERS: 			"_ereaders",
		SYSTEM_EWRITERS: 			"_ewriters",
		SYSTEM_TAGS: 				"_tags",
		SYSTEM_PARENTID: 			"_parentid",
		SYSTEM_SYNCMASTERID: 		"_syncmasterid",
			
		STORE_UNID_SEP:				':'
	};

	jstore.Index = {
	};

	jstore.Instance = {
	};

	jstore.Session = {
	};

	jstore.Store = {
		DOCUMENT_NOREADMARK:		0x0001,
		DOCUMENT_CREATE:			0x0002,
			
		DELETE_NORMAL:				0,  // normal document deletion
		DELETE_SOFT:				0x0001,  // the document is soft deleted if the DB supports it
		DELETE_ERASE:				0x0002,  // the document is fully erased with no deletion stubs

		DELETE_CHILDREN:		    0x0100,   // recursively delete the document children as well (responses)
		DELETE_SYNCSLAVES:		    0x0200   // delete the sync slave documents as well
	};
});

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

darwino.provide("darwino/jstore/urlbuilder",null,function() {

	var jstore = darwino.install("jstore");
	
	function UrlBuilder(baseUrl) {
		this._baseUrl = baseUrl;
		if(this._baseUrl && !darwino.Utils.endsWith(this._baseUrl,"/")) {
			this._baseUrl = this._baseUrl+"/";
		}
	}
	
	UrlBuilder.prototype.getBaseUrl = function() {
		return this._baseUrl||"";
	};
	
	UrlBuilder.prototype.getDatabaseUrl = function(database) {
		return this.getBaseUrl()+"databases/"+database;
	};
	
	UrlBuilder.prototype.getDesignElementUrl = function(database,name) {
		return this.getBaseUrl()+"design/"+database+"/"+name;
	};
	
	UrlBuilder.prototype.getStoreUrl = function(database, store) {
		return this.getBaseUrl()+"databases/"+database+"/stores/"+store;
	};
	
	UrlBuilder.prototype.getDocumentUrl = function(database, store, unid) {
		return this.getBaseUrl()+"databases/"+database+"/stores/"+store+"/documents/"+unid;
	};
	
	UrlBuilder.prototype.getAttachmentUrl = function(database, store, unid, name) {
		return (this.getBaseUrl()||"")+"databases/"+database+"/stores/"+store+"/documents/"+unid+"/attachments/"+name;
	};
	
	jstore._UrlBuilder = UrlBuilder;
});

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

darwino.provide("darwino/jstore/user",null,function() {

	var jstore = darwino.install("jstore");
	
	function User(dn,cn,groups,roles) {
		this._dn = dn || "anonymous";
		this._cn = cn || this._dn;
		this._groups = groups;
		this._roles = roles;
		this._attr = {};
	}
	User.prototype.isAnonymous = function() {
		return this._dn!="anonymous";
	};
	User.prototype.getDn = function() {
		return this._dn;
	};
	User.prototype.getCn = function() {
		return this._cn;
	};
	User.prototype.getDistinguishedName = function() {
		return this._dn;
	};
	User.prototype.getCommonName = function() {
		return this._cn;
	};
	User.prototype.getGroupCount = function() {
		return this._groups ? this._groups.length : 0;
	};
	User.prototype.getGroup= function(index) {
		return this._groups[index];
	};
	User.prototype.getGroups= function() {
		return this._groups;
	};
	User.prototype.getRoleCount = function() {
		return this._roles ? this._roles.length : 0;
	};
	User.prototype.getRole = function(index) {
		return this._roles[index];
	};
	User.prototype.getRoles = function() {
		return this._roles;
	};
	User.prototype.hasUserId = function(id) {
		return this._dn==id;
	};
	User.prototype.hasGroup = function(id) {
		if(this._groups) {
			for(var i=0; i<this._groups.length; i++) {
				if(this._groups[i]==id) {
					return true;
				}
			}
		}
		return false;
	};
	User.prototype.hasRole = function(id) {
		if(this._roles) {
			for(var i=0; i<this._roles.length; i++) {
				if(this._roles[i]==id) {
					return true;
				}
			}
		}
		return false;
	};
	User.prototype.getAttribute = function(attrName) {
		return this._attrs[attrName];
	};
	User.prototype.putAttribute = function(attrName,value) {
		this._attrs[attrName] = value;
	};
	
	jstore._User = User;
});

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

darwino.provide("darwino/jstore/remote/attachment",null,function() {

	var jstore = darwino.install("jstore");
	
	function Attachment(doc,name,content,length,mimeType,seqid,mdate) {
		this._doc = doc;
		this._name = name;
		this._dbOperation = jstore.Attachment.OP_CREATED;
		this._content = content;
		if(arguments.length>3) {
			this._length = length;
			this._mimeType = mimeType;
			this._seqid = seqid;
			this._mdate = mdate;
		} else {
			this._length = content.getLength();
			this._mimeType = content.getMimeType();
		}
	}
	
	Attachment.prototype.getHttpStoreClient = function() {
		return this._doc.getHttpStoreClient();	
	};

	Attachment.prototype.getSession = function() {
		return this._doc._store._database._session;
	};
	Attachment.prototype.getDatabase = function() {
		return this._doc._store._database;
	};
	Attachment.prototype.getStore = function() {
		return this._doc._store;
	};
	Attachment.prototype.getDocument = function() {
		return this._doc;
	};
	
	Attachment.prototype.getDbOperation = function() {
		return this._dbOperation;
	};
	Attachment.prototype.getSeqId = function() {
		return this._seqid;
	};
	Attachment.prototype.getLastModificationDate = function() {
		return this._mdate;
	};
	Attachment.prototype.getETag = function() {
		return this._name+"-"+this._mdate.getTime().toString(16);
	};
	Attachment.prototype.getName = function() {
		return this._name;
	};
	Attachment.prototype.getLength = function() {
		return this._length;
	};
	Attachment.prototype.getMimeType = function() {
		return this._mimeType;
	};
	Attachment.prototype.getBinKey = function() {
		return null;
	};

	Attachment.prototype.update = function(content) {
		if(this._dbOperation==jstore.Attachment.OP_DELETED) {
			throw new jstore.JsonException("Cannot update an attachment that is tagged as deleted");
		}
		if(this._dbOperation==jstore.Attachment.OP_NOOP) {
			this._dbOperation = jstore.Attachment.OP_UPDATED;
		}
		this._content = content;
		if(content!=null) {
			this._length = content.length;
			this._mimeType = content.mimetype;
		} else {
			this._length = 0;
			this._mimeType = null;
		}
	};

	Attachment.prototype.deleteAttachment = function() {
		this._dbOperation=jstore.Attachment.OP_DELETED;
		this._content = null;
	};
	Attachment.prototype.getAttachmentUrl = function() {
		var b = this.getSession().getUrlBuilder(); 
		return b ? b.getAttachmentUrl(this.getDatabase().getId(), this.getStore().getId(), this.getDocument().getUnid(), this.getName()) : null;
	};
	
	Attachment.prototype.readAsBinaryString = function() {
		if(this._content) {
			return this._content.getAsBinaryString();
		}
		return this.getHttpStoreClient().readAttachment(this._doc._store._database._name, this._doc._store._name, this._doc._unid, this._name);
	};
	Attachment.prototype.readAsBase64 = function() {
		if(this._content) {
			return this._content.getAsBase64();
		}
		return darwino.Utils.btoa(this.getHttpStoreClient().readAttachment(this._doc._store._database._name, this._doc._store._name, this._doc._unid, this._name));
	};
	Attachment.prototype.readAsString = function() {
		var s = this.readAsBinaryString();
		return darwino.Utils.fromUtf8(s);
	};


	jstore.createBinaryContent = function(mime,content,length) {
		return darwino.Utils.createBinaryContent(mime,content,length);
	};
	jstore.createBinaryContentBase64 = function(mime,b64,length) {
		return darwino.Utils.createBinaryContent(mime,b64?darwino.Utils.atob(b64):null,length);
	};
	
	jstore._RemoteAttachment = Attachment;
	
});

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

darwino.provide("darwino/jstore/remote/cursor",null,function() {

	var jstore = darwino.install("jstore");

	function Cursor(store, index) {
		this._store = store;
		this._index = index;
	}
	
	Cursor.prototype.getHttpStoreClient = function() {
		return this._store.getHttpStoreClient();	
	};

	Cursor.prototype.getSession = function() {
		return this._store._database._session;
	};
	Cursor.prototype.getDatabase = function() {
		return this._store._database;
	};
	Cursor.prototype.getStore = function() {
		return this._store;
	};
	Cursor.prototype.getIndex = function() {
		return this._index;
	};

	Cursor.prototype.key = function(key) {
		this._key = key;
		return this;
	};
	Cursor.prototype.partialKey = function(key) {
		this._partialKey = key;
		return this;
	};
	Cursor.prototype.tags = function(tags) {
		this._tags = Array.slice(arguments, 0);
		return this;
	};
	Cursor.prototype.id = function(id) {
		this._id = id;
		return this;
	};
	Cursor.prototype.unid = function(unid) {
		this._unid = unid;
		return this;
	};
	Cursor.prototype.parentUnid = function(parentId) {
		this._parentId = parentId;
		return this;
	};
	Cursor.prototype.parent = function(parent) {
		if(parent) {
			if(parent._store.getId()==this._store.getId()) {
				this.parentUnid(parent.getUnid());
			} else {
				this.parentUnid(parent.getUnid()+jstore.Document.STORE_UNID_SEP+parent._store.getId());
			}
		} else {
			this.setParentUnid(null);
		}
		return this;
	};
	Cursor.prototype.startKey = function(startKey, excludeStart) {
		this._startKey = startKey;
		this._excludeStart = excludeStart;
		return this;
	};
	Cursor.prototype.endKey = function(endKey, excludeEnd) {
		this._endKey = endKey;
		this._excludeEnd = excludeEnd;
		return this;
	};
	Cursor.prototype.options = function(options) {
		this._options = options;
		return this;
	};
	Cursor.prototype.hierarchical = function(hierarchical) {
		this._hierarchical = hierarchical;
		// Make sure that only the root documents are retrieved here
		if (hierarchical > 0 && !this._parentId) {
			this._parentId = jstore.Cursor.NULL_PARENT;
		}
		return this;
	};
	Cursor.prototype.hierarchySources = function(filter) {
		this._hierarchySources = Array.slice(arguments, 0);
		return this;
	};
	Cursor.prototype.range = function(skip, limit) {
		this._skip = skip;
		this._limit = limit;
		return this;
	};
	Cursor.prototype.orderBy = function(orderBy) {
		this._orderBy = Array.slice(arguments, 0);
		return this;
	};
	Cursor.prototype.categories = function(count,start) {
		this._categoryCount = count || 0;
		this._categoryStart = start || 0;
		return this;
	};
	Cursor.prototype.ascending = function() {
		delete this._descending;
		return this;
	};
	Cursor.prototype.descending = function() {
		this._descending = true;
		return this;
	};
	Cursor.prototype.orderByFtRank = function() {
		this.orderBy("_ftRank");
		return this;
	};

	Cursor.prototype.ftSearch = function(ftSearch) {
		this._ftSearch = ftSearch;
		return this;
	};

	Cursor.prototype.query = function(query) {
		if (!darwino.Utils.isString(query)) {
			query = darwino.Utils.toJson(query);
		}
		this._query = query;
		return this;
	};

	Cursor.prototype.extract = function(extraction) {
		if (!darwino.Utils.isString(extraction)) {
			extraction = darwino.Utils.toJson(extraction);
		}
		this._extract = extraction;
		return this;
	};

	Cursor.prototype.aggregate = function(agg) {
		if (!darwino.Utils.isString(agg)) {
			agg = darwino.Utils.fromJson(agg);
		}
		this._agg = agg;
		return this;
	};

	Cursor.prototype.subQueries = function() { // subQueries...
		this._subQueries = [].slice.call(arguments); // Makes it a real array
		return this;
	};
	
	Cursor.prototype.findSubQuery = function(name) { 
		if(this._subQueries) {
			for(var i=0; i<this._subQueries.length; i++) {
				if(this._subQueries[i].name==name) {
					return this._subQueries[i]; 
				}
			}
		}
		return null;
	};

	Cursor.prototype.count = function() {
		var res = this.getHttpStoreClient().count(this,false);
		return res["count"];
	};
	Cursor.prototype.countWithLimit = function() {
		var res = this.getHttpStoreClient().count(this,true);
		return res["count"];
	};

	Cursor.prototype.findOne = function() {
		var o = this.findOneJson();
		if (o) {
			return new jstore._RemoteCursorEntry(this, o);
		}
		return null;
	};
	Cursor.prototype.find = function(handler) {
		var a = this.findJson();
		if (a && handler) {
			var count = 0;
			for ( var i = 0; i < a.length; i++) {
				var e = new jstore._RemoteCursorEntry(this, a[i]);
				handler.handle ? handler.handle(e) : handler(e); // This is to easily support Rhino callbacks 
				if ((this._options & jstore.Cursor.RANGE_ROOT) == 0
						|| e.getHierarchicalLevel() == 0) {
					count++;
				}
			}
			return count;
		}
		return 0;
	};

	Cursor.prototype.findIds = function() {
		return this.getHttpStoreClient().findIds(this);
	};

	Cursor.prototype.findOneJson = function() {
		return this.getHttpStoreClient().findOneJson(this);
	};

	Cursor.prototype.findJson = function() {
		return this.getHttpStoreClient().findJson(this);
	};

	Cursor.prototype.findJsonTree = function() {
		return this.getHttpStoreClient().findJsonTree(this);
	};

	Cursor.prototype.deleteAllDocuments = function(options) {
		this.getHttpStoreClient().deleteCursor(this, options);
	};

	Cursor.prototype.markAllRead = function(read, userName) {
		this.getHttpStoreClient().markAllRead(this, read, userName);
	};

	Cursor.prototype.toJson = function() {
		var o = {};
		if (this._ftSearch != undefined) o.ftSearch = this._ftSearch;
		if (this._id > 0) o.id = this._id;
		if (this._unid != undefined) o.unid = this._unid;
		if (this._hierarchical > 0) o.hierarchical = this._hierarchical;
		if (this._hierarchySources) o.hierarchySources = this._hierarchySources;
		if (this._parentId != undefined) o.parentId = this._parentId;
		if (this._key != undefined) o.key = this._key;
		if (this._partialKey != undefined) o.partialKey = this._partialKey;
		if (this._startKey != undefined) o.startKey = this._startKey;
		if (this._excludeStart) o.excludeStart = true;
		if (this._endKey != undefined) o.endKey = this._endKey;
		if (this._excludeEnd) o.excludeEnd = true;
		if (this._orderBy) o.orderBy = this._orderBy;
		if (this._categoryCount) o.categoryCount = this._categoryCount;
		if (this._categoryStart) o.categoryStart = this._categoryStart;
		if (this._descending) o.descending = true;
		if (this._tags) o.tags = this._tags;
		if (this._skip > 0) o.skip = this._skip;
		if (this._limit > 0) o.limit = this._limit;
		if (this._options) o.options = this._options;
		if (this._query) o.query = this._query;
		if (this._extract) o.extract = this._extract;
		if (this._agg) o.aggregate = this._agg;
		if (this._subQueries) {
			var a = o.subQueries = [];
			for ( var i = 0; i < this._subQueries.length; i++) {
				var sq = this._subQueries[i];
				var c = sq.cursor;
				var jsq = {
					cursor : c.toJson(),
					name: sq.name,
					type : sq.type,
					params : sq.params
				};
				jsq.cursor.store = c.getStore().getId();
				if (c.getIndex())
					jsq.cursor.index = c.getIndex().getId();
				a.push(jsq);
			}
		}
		return o;
	};

	Cursor.prototype.fromJson = function(o) {
		this._ftSearch = o.ftSearch;
		this._id = o.id;
		this._unid = o.unid;
		this._hierarchical = o.hierarchical;
		this._hierarchySources = o.hierarchySources;
		this._parentId = o.parentId;
		this._key = o.key;
		this._partialKey = o.partialKey;
		this._startKey = o.startKey;
		this._excludeStart = o.excludeStart;
		this._endKey = o.endKey;
		this._excludeEnd = o.excludeEnd;
		this._orderBy = o.orderBy;
		this._categoryCount = o.categoryCount;
		this._categoryStart = o.categoryStart;
		this._descending = o.descending;
		this._tags = o.tags;
		this._skip = o.skip;
		this._limit = o.limit;
		this._options = o.options;
		this._query = o.query;
		this._extract = o.extract;
		this._agg = o.aggregate;
		if (o.subQueries) {
			var a = this._subQueries = [];
			for ( var i = 0; i < o.subQueries.length; i++) {
				var sq = o.subQueries[i];
				var st = this.getDatabase().getStore(sq.cursor.store);
				var c = sq.cursor.index ? new Cursor(st, st.getIndex(sq.cursor.index)) : new Cursor(st, null);
				c.fromJson(sq.cursor);
				var jo = {
					cursor : c,
					name: sq.name,
					type : sq.type,
					params : sq.params
				};
				a.push(jo);
			}
		}
	};

	jstore._RemoteCursor = Cursor;
});

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

darwino.provide("darwino/jstore/remote/cursorentry",null,function() {

	var jstore = darwino.install("jstore");

	function CursorEntry(cursor,entry) {
		this._cursor = cursor;
		this._entry = entry;
	}

	CursorEntry.prototype.getSession = function() {
		return this._cursor.getSession();
	};
	CursorEntry.prototype.getDatabase = function() {
		return this._cursor.getDatabase();
	};
	CursorEntry.prototype.getStore = function() {
		return this._cursor.getStore();
	};
	CursorEntry.prototype.getCursor = function() {
		return this._cursor;
	};
	
	CursorEntry.prototype.getPosition = function() {
		return this._entry["position"];
	};
	
	CursorEntry.prototype.getKey = function() {
		return this._entry["key"];
	};
	CursorEntry.prototype.getValue = function() {
		return this._entry["value"];
	};
	CursorEntry.prototype.getFtRank = function() {
		return this._entry["ftRank"];
	};
	CursorEntry.prototype.getStoreId = function() {
		return this._entry["storeId"];
	};
	CursorEntry.prototype.getDocId = function() {
		return this._entry["id"];
	};
	CursorEntry.prototype.getUnid = function() {
		return this._entry["unid"] || "";
	};
	CursorEntry.prototype.getCreationDate = function() {
		return this._entry["cdate"] ? new Date(this._entry["cdate"]) : null;
	};
	CursorEntry.prototype.getCreationUser = function() {
		return this._entry["cuser"] || "";
	};
	CursorEntry.prototype.getLastModificationDate = function() {
		return this._entry["mdate"] ? new Date(this._entry["mdate"]) : null;
	};
	CursorEntry.prototype.getLastModificationUser = function() {
		return this._entry["muser"] || "";
	};
	CursorEntry.prototype.getParentUnid = function() {
		return this._entry["parentUnid"] || "";
	};
	CursorEntry.prototype.getHierarchicalLevel = function() {
		return this._entry["hierarchicalLevel"] || 0;
	};
	CursorEntry.prototype.isCategory = function() {
		return this._entry["category"];
	};
	CursorEntry.prototype.getCategoryCount = function() {
		return this._entry["categoryCount"] || 0;
	};
	CursorEntry.prototype.isRead = function() {
		return this._entry["read"];
	};
	CursorEntry.prototype.isReadOnly = function() {
		return this._entry["readOnly"];
	};
	CursorEntry.prototype.indentLevel = function() {
		return this._entry["indentLevel"] || 0;
	};

	CursorEntry.prototype.loadDocument = function(options) {
		var doc = this._cursor.getDatabase().loadDocumentById(this.getDocId(),options);
		this._cursor.getStore().clearSocialDataCache(doc.getUnid());
		return doc;
	};
	
	CursorEntry.prototype.createJsonEntry = function() {
		return this._entry;
	};

	CursorEntry.prototype.get = function(fieldName) {
		var _json = this.getValue();
		if(darwino.Utils.isObject(_json)) {
			return _json[fieldName];
		}
		throw new jstore.JsonException("The JSON data is not an object");
	};
	CursorEntry.prototype.getString = function(fieldName) {
		var v = this.get(fieldName);
		return darwino.Utils.isString(v) ? v : null;
	};
	CursorEntry.prototype.getInt = function(fieldName) {
		var v = this.get(fieldName);
		return darwino.Utils.isNumber(v) ? v : null;
	};
	CursorEntry.prototype.getLong = function(fieldName) {
		var v = this.get(fieldName);
		return darwino.Utils.isNumber(v) ? v : null;
	};
	CursorEntry.prototype.getDouble = function(fieldName) {
		var v = this.get(fieldName);
		return darwino.Utils.isNumber(v) ? v : null;
	};
	CursorEntry.prototype.getBoolean = function(fieldName) {
		var v = this.get(fieldName);
		return darwino.Utils.isBoolean(v) ? v : null;
	};
	CursorEntry.prototype.getDate = function(fieldName) {
		var v = this.get(fieldName);
		if(darwino.Utils.isString(v)) {
			try {
				return darwino.Utils.stringToDate(v);
			} catch(e) {
				throw new jstore.JsonException("Error while parsing an ISO date");
			}
		}
		return null;
	};
	
	CursorEntry.prototype.getDocumentUrl = function() {
		var b = this.getSession().getUrlBuilder(); 
		return b ? b.getDocumentUrl(this.getDatabase().getId(), this.getStore().getId(), this.getUnid()) : null;
	};
	CursorEntry.prototype.getAttachmentUrl = function(name) {
		var b = this.getSession().getUrlBuilder(); 
		return b ? b.getAttachmentUrl(this.getDatabase().getId(), this.getStore().getId(), this.getUnid(), name) : null;
	};

	CursorEntry.prototype.findSubQueryEntries = function(name, handler) {
		var sq = this._cursor.findSubQuery(name);
		if(sq) {
			var a = this._entry[name];
			var count = 0;
			for(var i=0; i<a.length; i++) {
				var o = a[i];
				var e = new jstore._RemoteCursorEntry(sq.cursor, o);
				handler.handle(e);
				if((sq.cursor._options&jstore.Cursor.RANGE_ROOT)==0 || e.getHierarchicalLevel()==0) {
					count++;
				}
			}
			return count;
		}
		return 0;
	};
	
	jstore._RemoteCursorEntry = CursorEntry;
});

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

darwino.provide("darwino/jstore/remote/database",null,function() {

	var jstore = darwino.install("jstore");

	function Database(session,client,name,instance) {
		this._session = session;
		this._client = client;
		this._name = name;
		this._instance = instance;
	}
	
	Database.prototype.getHttpStoreClient = function() {
		return this._client;	
	};
	
	Database.prototype.getSession = function() {
		return this._session; 
	};
	
	Database.prototype.getUserContext = function() {
		this._getDatabaseDef(); // Load the metadata
		return this._userContext; 
	};
	
	Database.prototype.getInstance = function() {
		return this._instance; 
	};

	Database.prototype.getReplicationIdentifier = function() {
		return this._getDatabaseDef()["replicationIdentifier"]; 
	};

	Database.prototype.getId = function() {
		return this._name; 
	};

	Database.prototype.getLabel = function() {
		return this._getDatabaseDef()["label"]; 
	};

	Database.prototype.getReplicaId = function() {
		return this._getDatabaseDef()["replicaId"]; 
	};

	Database.prototype.getVersion = function() {
		return this._getDatabaseDef()["version"]; 
	};

	Database.prototype.getTimeZone = function() {
		return this._getDatabaseDef()["timeZone"]; 
	};

	Database.prototype.canReadDocument = function(){
		return ("canReadDocument" in this._getDatabaseDef()) ? this._getDatabaseDef()["canReadDocument"] : true;
	};
	Database.prototype.canCreateDocument = function(){
		return ("canCreateDocument" in this._getDatabaseDef()) ? this._getDatabaseDef()["canCreateDocument"] : true;
	};
	Database.prototype.canUpdateDocument = function(){
		return ("canUpdateDocument" in this._getDatabaseDef()) ? this._getDatabaseDef()["canUpdateDocument"] : true;
	};
	Database.prototype.canDeleteDocument = function(){
		return ("canDeleteDocument" in this._getDatabaseDef()) ? this._getDatabaseDef()["canDeleteDocument"] : true;
	};
	Database.prototype.canManage = function() {
		return ("canManage" in this._getDatabaseDef()) ? this._getDatabaseDef()["canManage"] : true;
	};

	Database.prototype.isReplicationEnabled = function() {
		return this._getDatabaseDef()["replicationEnabled"]; 
	};

	Database.prototype.isInstanceEnabled = function() {
		return this._getDatabaseDef()["instanceEnabled"]; 
	};

	Database.prototype.isJsonQuerySupported = function() {
		this._getDatabaseDef(); // Load the metadata
		return this._jsonQuery; 
	};
	
	Database.prototype.getDocumentSecurity = function() {
		return this._getDatabaseDef()["documentSecurity"]; 
	};
	
	Database.prototype.isFtSearchEnabled = function() {
		this._getDatabaseDef(); // Load the metadata
		return this._ftSearch; 
	};
	Database.prototype.updateFtSearchIndex = function(async){
		this.getHttpStoreClient().updateFtSearchIndex(this._name,async);
	};

	Database.prototype.storeExists = function(name) {
		var stores = this._getDatabaseDef()["stores"]; 
		return stores && stores[name];
	};
	Database.prototype.getStore = function(name) {
		return new jstore._RemoteStore(this,name);
	};
	Database.prototype.getStoreList = function() {
		var stores = this._getDatabaseDef()["stores"];
		if(stores) {
			var names = [];
			for(var n in stores) {
				names.push(n);
			}
			return names;
		}
		return [];
	};

	Database.prototype.documentCount = function() {
		var d = this.getHttpStoreClient().databaseDocumentCount(this._name);
		return d["count"];
	};
	
	Database.prototype.documentExistsById = function(id){
		return this.getHttpStoreClient().documentExistsById(this._name,id)["exists"];
	};
	
	Database.prototype.loadDocumentById = function(id,options,handler){
		var json = this.getHttpStoreClient().loadDocumentById(this._name,id,options);
		var store = this.getStore(json["store"]);
		var doc = new jstore._RemoteDocument(store,null);
		doc.updateJson(json);
		if(handler) {
			handler.handle(doc);
		} else {
			return doc;
		}
	};

	Database.prototype.deleteDocumentById = function(id,options){
		 return this.getHttpStoreClient().deleteDocumentById(this._name,id,options);
	};
	
	Database.prototype.deleteAllDocuments = function(options,before) {
		this.getHttpStoreClient().deleteAllDatabaseDocuments(this._name,options,before);
	};

	Database.prototype.getReplication = function() {
		throw new jstore.JsonException("Replication capabilities are not enabled for HTTP access");
	};

	Database.prototype.getJsonMetadata = function() {
		 return this._getDatabaseDef();
	};

	
	//
	// private implementation
	//
	Database.prototype._getDatabaseDef = function(){
		var def = this._session._application._getDatabaseDef(this._session.getUser().getDistinguishedName(),this._name,this._instance.getId());
		if(!def) {
			def = this.getHttpStoreClient().getDatabaseMetaData(this._name,this._instance.getId(),true);
			if(!def) {
				throw new jstore.JsonException("Database {0} does not exist",this._name);
			}
			var canAccess = ("canReadDocument" in def) ? def["canReadDocument"] : true;
			if(!canAccess) {
				throw new jstore.JsonException("Cannot access database {0}",_name);
			}
			this._session._application._putDatabaseDef(this._session.getUser().getDistinguishedName(),this._name,this._instance.getId(),def);
			
			var sessionData = def["sessionData"];
			var dc = sessionData["database"];
			this._jsonQuery = dc.jsonQuery || false;
			this._ftSearch = dc.ftSearch || false;
			var uc = sessionData["userContext"];
			this._userContext = new jstore._RemoteUserContext(this._session.getUser(),uc.securityEnabled,uc.entries);
		}
		return def;
	};
	
	jstore._RemoteDatabase = Database;
});

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

darwino.provide("darwino/jstore/remote/document",null,function() {

	var jstore = darwino.install("jstore");
	
	function Document(store,unid) {
		this._store = store;
		this._unid = unid;
		this._json = {};
		this._replicaId = store._database.getReplicaId();

		this._id = 0;
		this._seqId = 0;
		this._updateId = 0;
		this._cdate = null;
		this._cuser = null;
		this._mdate = null;
		this._muser = null;
		this._changes = null;
		this._attachments = [];
	}

	Document.STORE_UNID_SEP 			= ":";

	Document.prototype.getHttpStoreClient = function() {
		return this._store.getHttpStoreClient();
	};
	
	Document.prototype.getSession = function() {
		return this._store._database._session;
	};
	Document.prototype.getDatabase = function() {
		return this._store._database;
	};
	Document.prototype.getStore = function() {
		return this._store;
	};
	
	Document.prototype.getDocId = function() {
		return this._id;
	};
	Document.prototype.getUnid = function() {
		return this._unid;
	};
	Document.prototype.getReplicaId = function() {
		return this._replicaId;
	};
	Document.prototype.getCreationDate = function() {
		return this._cdate;
	};
	Document.prototype.getCreationUser = function() {
		return this._cuser;
	};
	Document.prototype.getLastModificationDate = function() {
		return this._mdate;
	};
	Document.prototype.getLastModificationUser = function() {
		return this._muser;
	};
	Document.prototype.getETag = function() {
		if(this._unid && this._mdate) {
			return this._unid+"-"+this._mdate.getTime().toString(16);
		}
		return null;
	};
	Document.prototype.getChanges = function() {
		return this._changes;
	};
	
	Document.prototype.getSeqId = function() {
		return this._seqId;
	};
	Document.prototype.getUpdateId = function() {
		return this._updateId;
	};
	Document.prototype.getParentUnid = function() {
		return this.getString(jstore.Document.SYSTEM_PARENTID);
	};
	Document.prototype.setParentUnid = function(parentUnid) {
		if(parentUnid) {
			this.set(jstore.Document.SYSTEM_PARENTID,parentUnid);
		} else {
			this.remove(jstore.Document.SYSTEM_PARENTID);
		}
		return this;
	};
	Document.prototype.getParent = function() {
		var id = this.getString(jstore.Document.SYSTEM_PARENTID);
		if(id) {
			var pos = id.indexOf(jstore.Document.STORE_UNID_SEP);
			if(pos>=0) {
				var storeId = id.substring(pos+1);
				id = id.substring(0,pos);
				return this.getDatabase().getStore(storeId).loadDocument(id);
			} else {
				return this.getStore().loadDocument(id);
			}
		}
		return null;
	};
	Document.prototype.setParent = function(parent) {
		if(parent) {
			if(parent._store.getId()==this._store.getId()) {
				this.setParentUnid(parent.getUnid());
			} else {
				this.setParentUnid(parent.getUnid()+jstore.Document.STORE_UNID_SEP+parent._store.getId());
			}
		} else {
			this.setParentUnid(null);
		}
		return this;
	};
	Document.prototype.getSyncMasterUnid = function() {
		return this.getString(jstore.Document.SYSTEM_SYNCMASTERID);
	};
	Document.prototype.setSyncMasterUnid = function(syncMasterUnid) {
		if(syncMasterUnid) {
			this.set(jstore.Document.SYSTEM_SYNCMASTERID,syncMasterUnid);
		} else {
			this.remove(jstore.Document.SYSTEM_SYNCMASTERID);
		}
		return this;
	};
	Document.prototype.getSyncMaster = function() {
		var id = this.getString(jstore.Document.SYSTEM_SYNCMASTERID);
		if(id) {
			var pos = id.indexOf(jstore.Document.STORE_UNID_SEP);
			if(pos>=0) {
				var storeId = id.substring(pos+1);
				id = id.substring(0,pos);
				return this.getDatabase().getStore(storeId).loadDocument(id);
			} else {
				return this.getStore().loadDocument(id);
			}
		}
		return this;
	};
	Document.prototype.setSyncMaster = function(syncMaster) {
		if(syncMaster) {
			if(syncMaster._store.getId()==this._store.getId()) {
				this.setSyncMasterUnid(syncMaster.getUnid());
			} else {
				this.setSyncMasterUnid(syncMaster.getUnid()+jstore.Document.STORE_UNID_SEP+syncMaster.getStore().getId());
			}
		} else {
			this.setSyncMasterUnid(null);
		}
		return this;
	};
	Document.prototype.childrenCount = function() {
		if(!this.isNewDocument()) {
			 return this._store.childrenCount(this._unid);
		}
		return 0;
	};
	Document.prototype.getChildren = function() {
		return this.getHttpStoreClient().getChildren(this._store._database._name, this._store._name, this._unid);
	};
	Document.prototype.getSyncSlaves = function() {
		return this.getHttpStoreClient().getSyncSlaves(this._store._database._name, this._store._name, this._unid);
	};
	Document.prototype.isNewDocument = function() {
		return this._id==0;
	};
	Document.prototype.save = function(options) {
		// The json contain even the attachment content
		var json = this.getHttpStoreClient().save(
				this._store._database._name,
				this._store._name,
				this._id,
				this._unid,
				options,
				this.asJson(jstore.Document.JSON_DOCUMENT|jstore.Document.JSON_UPDATEDATTACHMENTS|jstore.Document.JSON_ATTACHMENTCONTENT),null);
		this.updateJson(json);
		this.getStore().clearSocialDataCache(this.getUnid());
	};
	Document.prototype.deleteDocument = function(options) {
		this.getHttpStoreClient().deleteDocument(this._store._database._name, this._store._name, this._unid, options);
		this.getStore().clearSocialDataCache(this.getUnid());
	};

	Document.prototype.isShared = function() {
		return this._store.isShared(this._unid, null);
	};
	Document.prototype.share = function(share) {
		return this._store.share(this._unid, share, null);
	};
	Document.prototype.getShareCount = function() {
		return this._store.getShareCount(this._unid);
	};

	Document.prototype.getRate = function() {
		return this._store.getRate(this._unid, null);
	};
	Document.prototype.rate = function(rate) {
		return this._store.rate(this._unid, rate, null);
	};
	Document.prototype.getRateAvg = function() {
		return this._store.getRateAvg(this._unid);
	};

	Document.prototype.isRead = function() {
		return this._store.isRead(this._unid, null);
	};
	Document.prototype.markRead = function(read) {
		return this._store.markRead(this._unid, read, null);
	};
	Document.prototype.getReadCount = function() {
		return this._store.getReadCount(this._unid);
	};
	
	Document.prototype.canUpdateDocument = function() {
		// Read the current readers/editors?
		return true;
	};
	Document.prototype.canDeleteDocument = function() {
		// Read the current readers/editors?
		return true;
	};

	Document.prototype.getJson = function() {
		return this._json;
	};
	Document.prototype.getJsonString = function(compact) {
		return this._store._database._session.toJson(this._json,compact);
	};
	Document.prototype.setJson = function(json) {
		if(!json) {
			throw new jstore.JsonException("Cannot assign a null JSON value to a document, {0}",this);
		}
		this._json = json;
		return this;
	};
	Document.prototype.setJsonString = function(json) {
		return this.setJson(this._store._database._session.fromJson(json));
	};

	Document.prototype.get = function(fieldName) {
		if(darwino.Utils.isObject(this._json)) {
			return this._json[fieldName];
		}
		throw new jstore.JsonException("The JSON data is not an object");
	};
	Document.prototype.getString = function(fieldName) {
		var v = this.get(fieldName);
		return darwino.Utils.isString(v) ? v : null;
	};
	Document.prototype.getInt = function(fieldName) {
		var v = this.get(fieldName);
		return darwino.Utils.isNumber(v) ? v : null;
	};
	Document.prototype.getLong = function(fieldName) {
		var v = this.get(fieldName);
		return darwino.Utils.isNumber(v) ? v : null;
	};
	Document.prototype.getDouble = function(fieldName) {
		var v = this.get(fieldName);
		return darwino.Utils.isNumber(v) ? v : null;
	};
	Document.prototype.getBoolean = function(fieldName) {
		var v = this.get(fieldName);
		return darwino.Utils.isBoolean(v) ? v : null;
	};
	Document.prototype.getDate = function(fieldName) {
		var v = this.get(fieldName);
		if(darwino.Utils.isString(v)) {
			try {
				return darwino.Utils.stringToDate(v);
			} catch(e) {
				throw new jstore.JsonException("Error while parsing an ISO date");
			}
		}
		return null;
	};

	Document.prototype.set = function(fieldName,value) {
		if(!this._json) {
			this._json = {};
		} else if(!darwino.Utils.isObject(this._json)) {
			throw new jstore.JsonException("Root document value is not a Json object");
		}
		if(darwino.Utils.isDate(value)) {
			try {
				value = darwino.Utils.dateToString(value);
			} catch(e) {
				throw new jstore.JsonException("Error while converting an ISO date {0}",value);
			}
		}
		this._json[fieldName] = value;
		return this;
	};

	Document.prototype.remove = function(fieldName) {
		if(this._json) {
			if(!darwino.Utils.isObject(this._json)) {
				throw new jstore.JsonException("Root document value is not a Json object");
			}
			delete this._json[fieldName];
		}
		return this;
	};

	
	Document.prototype.jsonPath = function(path) {
		if(darwino.Utils.isString(path)) {
			return darwino.Utils.jsonPath(this._json,path,null);
		}
		throw new jstore.JsonException("Object is not a valid json path. Should be a String");
	};
	Document.prototype.compile = function(path) {
		if(darwino.Utils.isString(path)) {
			return path;
		}
		throw new jstore.JsonException("Object is not a valid json path. Should be a String");
	};


	Document.prototype.getAttachmentCount = function() {
		return this._attachments.length;
	};
	Document.prototype.getAttachments = function() {
		return this._attachments;
	};
	Document.prototype.getAttachment = function(name) {
		for(var i=0; i<this._attachments.length; i++) {
			var a = this._attachments[i];
			if(a._name==name) {
				return a;
			}
		}
		return null;
	};
	
	Document.prototype.attachmentExists = function(name) {
		return this.getAttachment(name)!=null;
	};
	Document.prototype.createAttachment = function(name,content) {
		// Look if the attachment already exists
		if(this.getAttachment(name)) {
			throw new jstore.JsonException(null,"Attachment {0} already exists, {1}",name,toString());
		}
		var att = new jstore._RemoteAttachment(this, name, content);
		this._attachments.push(att);
		return att;
	};

	Document.prototype.deleteAllAttachments = function(name) {
		var allAtt = this._attachments;
		this._attachments = [];
		if(!this.isNewDocument()) {
			for(var i=0; i<allAtt.length; i++) {
				var a = allAtt[i];
				if(a._dbOperation!=jstore.Attachment.OP_CREATED) {
					a.deleteAttachment();
					this._attachments.push(a);
				}
			}
		}
	};

	Document.prototype.asJson = function(flags) {
		var o = {};
		o["store"]=this._store._id;
		if(this._id) o["id"]=this._id;
		if(this._unid) o["unid"]=this._unid;
		if(this._replicaId) o["replicaId"]=this._replicaId;
		if(this._seqId) o["seqId"]=this._seqId;
		if(this._updateId) o["updateId"]=this._updateId;
		if(this._cdate) o["cdate"]=this._cdate.getTime();
		if(this._cuser) o["cuser"]=this._cuser;
		if(this._mdate) o["mdate"]=this._mdate.getTime();
		if(this._muser) o["muser"]=this._muser;
		if(this._changes) o["changes"]=this._changes;
		if((flags&(jstore.Document.JSON_DOCUMENT))!=0) {
			if(this._json) o["json"]=this._json;
		}
		// we add the attachments for references
		if((flags&(jstore.Document.JSON_ALLATTACHMENTS|jstore.Document.JSON_UPDATEDATTACHMENTS))!=0) {
			if(this._attachments.length>0) {
				var array = [];
				for(var i=0; i<this._attachments.length; i++) {
					var att = this._attachments[i];
					if((flags&(jstore.Document.JSON_ALLATTACHMENTS))!=0 || att._dbOperation!=jstore.Attachment.OP_NOOP) {
						var a = {};
						if(att._dbOperation) a["op"]=att._dbOperation;
						if(att._seqId) a["seqId"]=att._seqId;
						if(att._mdate) a["mdate"]=att._mdate.getTime();
						if(att._name) a["name"]=att._name;
						if(att._length) a["length"]=att._length;
						if(att._mimeType) a["mimeType"]=att._mimeType;
						if((flags&(jstore.Document.JSON_ATTACHMENTCONTENT))!=0 && att._dbOperation!=jstore.Attachment.OP_DELETED) {
							a["content"]=att.readAsBase64();
						}
						if((flags&(jstore.Document.JSON_ATTACHMENTURL))!=0) {
							a["url"]=att.getAttachmentUrl();
						}
						array.push(a);
					}
				}
				if(array.length>0) {
					o["attachments"]=array;
				}
			}
		}
		return o;
	};
	
	Document.prototype.updateJson = function(o) {
		this._id = o["id"]||0;
		this._unid = o["unid"];
		this._replicaId = o["replicaId"];
		this._seqId = o["seqId"]||0;
		this._updateId = o["updateId"];
		this._cdate = o["cdate"] ? new Date(o["cdate"]) : null;
		this._cuser = o["cuser"];
		this._mdate = o["mdate"] ? new Date(o["mdate"]) : null;
		this._muser = o["muser"];
		this._changes = o["changes"];
		this._json = o["json"];
		
		// We should update the attachments here using a MIME type
		this._attachments = [];
		var a = o["attachments"];
		if(a) {
			for(var i=0; i<a.length; i++) {
				var oa = a[i];
				var op = oa["op"] || jstore.Attachment.OP_NOOP;
				var seqId = oa["seqId"]||0;
				var mdate = new Date(oa["mdate"]);
				var name = oa["name"];
				var length = oa["length"]||0;
				var mimeType = oa["mimeType"];
				var content = null;
				var contentb64 = oa["content"];
				if(contentb64) {
					content = darwino.Utils.createBinaryContent(mimeType,darwino.Utils.atob(contentb64),length);
				}
				var att = new jstore._RemoteAttachment(this, name, content, length, mimeType, seqId, new Date(mdate));
				att._dbOperation = op;
				this._attachments.push(att);
			}
		}
		
		return this;
	};
	
	//
	// Url
	// 
	Document.prototype.getDocumentUrl = function() {
		var b = this.getSession().getUrlBuilder(); 
		return b ? b.getDocumentUrl(this.getDatabase().getId(), this.getStore().getId(), this.getUnid()) : null;
	};
	Document.prototype.getAttachmentUrl = function(name) {
		var b = this.getSession().getUrlBuilder(); 
		return b ? b.getAttachmentUrl(this.getDatabase().getId(), this.getStore().getId(), this.getUnid(), name) : null;
	};
	

	jstore._RemoteDocument = Document;
});

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

darwino.provide("jstore/remote/httpapplication",null,function() {

	var jstore = darwino.install("jstore");
	
	var defInstance = null;

	function Application(baseUrl) {
		this._databaseDefs = {}; // For HTTP access, we store that per user as the security flags ('canaccess'...) are user related
		this._urlBuilder = new jstore._UrlBuilder(baseUrl);
	}
	
	Application.prototype.close = function() {
	};

	Application.prototype.createSession = function(instanceName) {
		var jsonClient = new darwino.Utils._JsonHttpClient(this._urlBuilder.getBaseUrl()); 
		var client = new jstore._HttpStoreClient(jsonClient,instanceName);
		return new jstore._RemoteSession(client, this, instanceName);
	};

	Application.prototype.createBasicSession = function(userName,password,instanceName) {
		var jsonClient = new darwino.Utils._JsonHttpClient(this._urlBuilder.getBaseUrl(), userName, password); 
		var client = new jstore._HttpStoreClient(jsonClient,instanceName);
		return new jstore._RemoteSession(client, this, instanceName);
	};

	Application.prototype._getDatabaseDef = function(user,name,instance) {
		var key = name + '|' + user + '|' + instance;
		return this._databaseDefs[key];
	};

	Application.prototype._putDatabaseDef = function(user,name,instance,def) {
		var key = name + '|' + user + '|' + instance;
		this._databaseDefs[key] = def;
	};

	Application.prototype._createInstance = function(name) {
		if(name) {
			return new darwino.jstore._RemoteInstance(name);
		}
		if(!defInstance) {
			defInstance = new darwino.jstore._RemoteInstance("");
		}
		return defInstance;
	};

	jstore.createRemoteApplication = function(url) {
		return new Application(url);
	};
});

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

darwino.provide("darwino/jstore/remote/httpstoreclient",null,function() {

	var jstore = darwino.install("jstore");
	
	var CURSOR_AS_GET = false;

	function HttpStoreClient(jsonClient,instanceName) {
		this._jsonClient = jsonClient;
		this._instanceName = instanceName;
	}
	
	HttpStoreClient.prototype.queryString = function(instanceName) {
		var qs = {};
		if(this._instanceName!=undefined && this._instanceName!=null) { // Empty string should work!
			qs["instance"] = this._instanceName;
		}
		return qs;
	};

	HttpStoreClient.prototype.getHttpClient = function() {
		return this._jsonClient;
	};
	
	HttpStoreClient.prototype.getUserImpl = function() {
		var params = this.queryString();
		var u = this._jsonClient.getAsJson(["user"],params);
		return new jstore._User(u.dn,u.cn,u.groups,u.roles);
	};

	HttpStoreClient.prototype.getDatabaseList = function() {
		var params = this.queryString();
		var dbs = this._jsonClient.getAsJson(["databases"],params);
		var n = new Array(dbs.length);
		for(var i=0; i<n.length; i++) {
			n[i] = dbs[i]["id"];
		}
		return n;
	};

	HttpStoreClient.prototype.deployDatabase = function(databaseName, version, meta, force) {
		var params = {};
		if(version>0) {
			params["version"] = version;
		}
		if(force) {
			params["force"] = force;
		}
		return this._jsonClient.postJsonAsEmpty(["databases",databaseName,"deploy"],params,meta);
	};

	HttpStoreClient.prototype.undeployDatabase = function(databaseName) {
		return this._jsonClient.getAsEmpty(["databases", databaseName, "undeploy"]);
	};

	HttpStoreClient.prototype.resetDatabase = function(databaseName) {
		return this._jsonClient.getAsEmpty(["databases", databaseName, "reset"]);
	};

	HttpStoreClient.prototype.getDatabaseMetaData = function(databaseName,instanceName,sessionData) {
		var params = {instance: instanceName||''};
		if(sessionData) {
			params["sessiondata"] = sessionData;
		}
		return this._jsonClient.getAsJson(["databases",databaseName],params);
	};

	HttpStoreClient.prototype.databaseDocumentCount = function(databaseName) {
		var params = this.queryString();
		return this._jsonClient.getAsJson(["databases", databaseName, "documentscount"],params);
	};

	HttpStoreClient.prototype.deleteAllDatabaseDocuments = function(databaseName,options,before) {
		var params = this.queryString();
		if(before>0) {
			params["before"]=before;
		}
		if(options) {
			params["options"]=options;
		}
		return this._jsonClient.deleteAsJson(["databases", databaseName, "documents"],params);
	};

	HttpStoreClient.prototype.deleteDocument = function(databaseName,storeName,unid,options) {
		var params = this.queryString();
		if(options) {
			params["options"]=options;
		}
		return this._jsonClient.deleteAsJson(["databases", databaseName, "stores", storeName, "documents", unid],params);
	};
	HttpStoreClient.prototype.deleteDocumentById = function(databaseName,id,options) {
		var params = this.queryString();
		if(options) {
			params["options"]=options;
		}
		return this._jsonClient.deleteAsJson(["databases", databaseName, "documents", id],params);
	};

	HttpStoreClient.prototype.deleteAllDocuments = function(databaseName,storeName,indexName,options,before) {
		var params = this.queryString();
		if(before>0) {
			params["before"]=before;
		}
		if(options) {
			params["options"]=options;
		}
		if(indexName) {
			return this._jsonClient.deleteAsJson(["databases", databaseName, "stores", storeName, "indexes", indexName, "documents"],params);
		} else {
			return this._jsonClient.deleteAsJson(["databases", databaseName, "stores", storeName, "documents"],params);
		}
	};
	HttpStoreClient.prototype.updateFtSearchIndex = function(databaseName,async) {
		var params = this.queryString();
		if(async) {
			params["async"]=true;
		}
		return this._jsonClient.getAsEmpty(["databases", databaseName, "updateftindex"],params);
	};

	HttpStoreClient.prototype.documentExists = function(databaseName,storeName,unid) {
		var params = this.queryString();
		return this._jsonClient.getAsJson(["databases", databaseName, "stores", storeName, "documentexists", unid],params);
	};

	HttpStoreClient.prototype.documentExistsById = function(databaseName,id) {
		var params = this.queryString();
		return this._jsonClient.getAsJson(["databases", databaseName, "documentexists", id],params);
	};

	HttpStoreClient.prototype.documentExistsByIndex = function(databaseName,storeName,indexName,key) {
		var params = this.queryString();
		var jkey = darwino.Utils.toJson(key);
		return this._jsonClient.getAsJson(["databases", databaseName, "stores", storeName, "indexes", indexName, "documentexists", jkey],params);
	};

	HttpStoreClient.prototype.documentDeleted = function(databaseName,storeName,unid) {
		var params = this.queryString();
		return this._jsonClient.getAsJson(["databases", databaseName, "stores", storeName, "documentdeleted", unid],params);
	};

	HttpStoreClient.prototype.documentCount = function(databaseName,storeName,unid) {
		var params = this.queryString();
		return this._jsonClient.getAsJson(["databases", databaseName, "stores", storeName, "documentscount"],params);
	};
	HttpStoreClient.prototype.getDocuments = function(databaseName,storeName) {
		var params = this.queryString();
		return this._jsonClient.getAsJson(["databases", databaseName, "stores", storeName, "documentids"],params);
	};

	HttpStoreClient.prototype.childrenCount = function(databaseName,storeName,unid) {
		var params = this.queryString();
		return this._jsonClient.getAsJson(["databases", databaseName, "stores", storeName, "childrencount", unid],params);
	};
	HttpStoreClient.prototype.getChildren = function(databaseName,storeName,unid) {
		var params = this.queryString();
		return this._jsonClient.getAsJson(["databases", databaseName, "stores", storeName, "children", unid],params);
	};
	HttpStoreClient.prototype.getSyncSlaves = function(databaseName,storeName,unid) {
		var params = this.queryString();
		return this._jsonClient.getAsJson(["databases", databaseName, "stores", storeName, "syncslaves", unid],params);
	};

	HttpStoreClient.prototype.loadDocument = function(databaseName,storeName,unid,options) {
		var params = this.queryString();
		if(options) {
			params["options"]=options;
		}
		return this._jsonClient.getAsJson(["databases", databaseName, "stores", storeName, "documents", unid],params);
	};
	HttpStoreClient.prototype.loadDocumentById = function(databaseName,id,options) {
		var params = this.queryString();
		if(options) {
			params["options"]=options;
		}
		return this._jsonClient.getAsJson(["databases", databaseName, "documents", id],params);
	};
	HttpStoreClient.prototype.loadDocumentByIndex = function(databaseName,storeName,indexName,key,options) {
		var params = this.queryString();
		if(options) {
			params["options"]=options;
		}
		var jkey = darwino.Utils.toJson(key);
		return this._jsonClient.getAsJson(["databases", databaseName, "stores", storeName, "indexes", indexName,"documents", jkey],params);
	};

	HttpStoreClient.prototype.getTags = function(databaseName,storeName,maxTags,sortByName) {
		var params = this.queryString();
		if(maxTags>0) {
			params["maxtags"]=maxTags;
		}
		if(sortByName) {
			params["sortbyname"]=true;
		}
		return this._jsonClient.getAsJson(["databases", databaseName, "stores", storeName, "tags"],params);
	};

	HttpStoreClient.prototype.getSocialData = function(databaseName,storeName,unid,userName) {
		var params = this.queryString();
		if(userName) {
			params["user"]=userName;
		}
		return this._jsonClient.getAsJson(["databases", databaseName, "stores", storeName, "documents", unid, "social"],params);
	};

	HttpStoreClient.prototype.updateSocialData = function(databaseName,storeName,unid,share,read,rate,userName) {
		var params = this.queryString();
		if(userName) {
			params["user"]=userName;
		}
		if(share!=null) {
			params["share"]=share;
		}
		if(read!=null) {
			params["read"]=read;
		}
		if(rate!=null) {
			params["rate"]=rate;
		}
		return this._jsonClient.putEmptyAsJson(["databases", databaseName, "stores", storeName, "documents", unid, "social"],params);
	};

	HttpStoreClient.prototype.save = function(databaseName,storeName,id,unid,options,docAsJson) {
		var params = this.queryString();
		var newDocument = id==0;
		if(options) {
			params["options"]=options;
		}
		if(newDocument) {
			if(!unid) {
				docAsJson = this._jsonClient.postJsonAsJson(["databases", databaseName, "stores", storeName, "documents"],params, docAsJson);
			} else {
				docAsJson = this._jsonClient.postJsonAsJson(["databases", databaseName, "stores", storeName, "documents", unid],params, docAsJson);
			}
		} else {
			docAsJson = this._jsonClient.putJsonAsJson(["databases", databaseName, "stores", storeName, "documents", unid],params, docAsJson);
		}
		return docAsJson;
	};

	HttpStoreClient.prototype.deleteByUnid = function(databaseName,storeName,unid,options) {
		var params = this.queryString();
		if(options) {
			params["options"]=options;
		}
		return this._jsonClient.deleteAsJson(["databases", databaseName, "stores", storeName, "documents", unid],params);
	};

	HttpStoreClient.prototype.count = function(cursor,limit) {
		var params = this.queryString();
		if(limit) {
			params["limit"] = true;
			return this._cursorAsJson(cursor,"count",params);  
		} else {
			return this._cursorAsJson(cursor,"count",params);  
		}
	};

	HttpStoreClient.prototype.findIds = function(cursor) {
		var params = this.queryString();
		return this._cursorAsJson(cursor,"ids",params);  
	};

	HttpStoreClient.prototype.deleteCursor = function(cursor,options) {
		var params = _composeParams(cursor,this.queryString());
		if(options) {
			params["options"]=options;
		}
		if(cursor.getIndex()) {
			this._jsonClient.getAsEmpty(["databases",cursor.getDatabase().getId(),"stores",cursor.getStore().getId(),"indexes",cursor.getIndex().getId(),"deleteall"],params);
		} else {
			this._jsonClient.getAsEmpty(["databases",cursor.getDatabase().getId(),"stores",cursor.getStore().getId(),"deleteall"],params);
		}
	};

	HttpStoreClient.prototype.markAllRead = function(cursor,read,userName) {
		var params = _composeParams(cursor,this.queryString());
		params["read"]=read;
		if(userName) {
			params["user"]=userName;
		}
		if(cursor.getIndex()!=null) {
			this._jsonClient.getAsEmpty(["databases",cursor.getDatabase().getId(),"stores",cursor.getStore().getId(),"indexes",cursor.getIndex().getId(),"markallread"],params);
		} else {
			this._jsonClient.getAsEmpty(["databases",cursor.getDatabase().getId(),"stores",cursor.getStore().getId(),"markallread"],params);
		}
	};

	HttpStoreClient.prototype.findOneJson = function(cursor) {
		var params = this.queryString();
		return this._cursorAsJson(cursor,"entry",params);  
	};

	HttpStoreClient.prototype.findJson = function(cursor) {
		var params = this.queryString();
		return this._cursorAsJson(cursor,"entries",params);  
	};

	HttpStoreClient.prototype.findJsonTree = function(cursor) {
		var params = this.queryString();
		params["jsontree"]=true;
		return this._cursorAsJson(cursor,"entries",params);  
	};

	HttpStoreClient.prototype._cursorAsJson = function(cursor,method,params) {
		if(this.cursorAsGet()) {
			var params = _composeParams(cursor,params);
			if(cursor.getIndex()) {
				return this._jsonClient.getAsJson(["databases",cursor.getDatabase().getId(),"stores",cursor.getStore().getId(),"indexes",cursor.getIndex().getId(),method],params);
			} else {
				return this._jsonClient.getAsJson(["databases",cursor.getDatabase().getId(),"stores",cursor.getStore().getId(),method],params);
			}
		} else {
			var json = cursor.toJson();
			if(cursor.getIndex()) {
				return this._jsonClient.postJsonAsJson(["databases",cursor.getDatabase().getId(),"stores",cursor.getStore().getId(),"indexes",cursor.getIndex().getId(),method],params,json);
			} else {
				return this._jsonClient.postJsonAsJson(["databases",cursor.getDatabase().getId(),"stores",cursor.getStore().getId(),method],params,json);
			}
		}
	};
	HttpStoreClient.prototype.cursorAsGet = function() {
		return CURSOR_AS_GET;
	};
	
	function _composeParams(cursor,params) {
		if(cursor._ftSearch) {
			params["ftsearch"]=cursor._ftSearch;
		}
		if(cursor._unid) {
			params["unid"]=cursor._unid;
		}
		if(cursor._parentId) {
			params["parentid"]=cursor._parentId;
		}
		if(cursor._key) {
			params["key"]=darwino.Utils.toJson(cursor._key);
		}
		if(cursor._partialKey) {
			params["partialkey"]=darwino.Utils.toJson(cursor._partialKey);
		}
		if(cursor._tags) {
			params["tags"]=cursor._tags.join();
		}
		if(cursor._startKey) {
			params["startkey"]=darwino.Utils.toJson(cursor._startKey);
			if(cursor._excludeStart) {
				params["excludestart"]=true;
			}
		}
		if(cursor._endKey!=null) {
			params["endkey"]=darwino.Utils.toJson(cursor._endKey);
			if(cursor._excludeEnd) {
				params["excludeend"]=true;
			}
		}
		if(cursor._skip>0 || cursor._limit>0) {
			params["skip"]=Math.max(0,cursor._skip);
			params["limit"]=Math.max(0,cursor._limit);
		}
		if(cursor._hierarchical>0) {
			params["hierarchical"]=cursor._hierarchical;
		}
		if(cursor._hierarchySources) {
			params["hierarchysources"]=cursor._hierarchySources.join();
		}
		if(cursor._orderBy) {
			params["orderby"]=true;
		}
		if(cursor._categoryCount) {
			params["categoryCount"]=true;
		}
		if(cursor._categoryStart) {
			params["categoryStart"]=true;
		}
		if(cursor._descending) {
			params["descending"]=true;
		}
		if(cursor._options>0) {
			params["options"]=cursor._options;
		}
		if(cursor._query) {
			params["query"]=darwino.Utils.toJson(darwino.Utils.fromJson(cursor._query));
		}
		if(cursor._extract) {
			params["extract"]=darwino.Utils.toJson(darwino.Utils.fromJson(cursor._extract));
		}
		if(cursor._agg) {
			params["aggregator"]=darwino.Utils.toJson(darwino.Utils.fromJson(cursor._agg));
		}
		return params;
	}

	HttpStoreClient.prototype.readAttachment = function(databaseName,storeName,unid,attachmentName) {
		var params = this.queryString();
		var s = this._jsonClient.getAsBinaryString(["databases",databaseName,"stores",storeName,"documents",unid,"attachments",attachmentName],params);
		return s;
	};

/*	
	// Attachment
	public void readAttachment(String databaseName, String storeName, String unid, String attachmentName, OutputStream os) throws JsonException {
		try {
			InputStream is = getAsInputStream(null,"databases",databaseName,"stores",storeName,"documents",unid,"attachments",attachmentName);
			try {
				StreamUtil.copyStream(is, os);
			} finally {
				StreamUtil.close(is);
			}
		} catch(IOException ex) {
			throw new JsonHttpDBException(ex,"Error while reading attachment {0}",attachmentName);
		}
	}
	public InputStream readAttachmentStream(String databaseName, String storeName, String unid, String attachmentName) throws JsonException {
		return getAsInputStream(null,"databases",databaseName,"stores",storeName,"documents",unid,"attachments",attachmentName);
	}
	
	private String keyAsString(Object key) throws JsonException {
		return JsonFactoryEx.instance.toJson(key);
	}
*/	
	
	jstore._HttpStoreClient = HttpStoreClient;
});

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

darwino.provide("darwino/jstore/remote/index",null,function() {

	var jstore = darwino.install("jstore");

	function Index(store,name) {
		this._store = store;
		this._name = name;
	}

	Index.prototype.getHttpStoreClient = function() {
		return this._store.getHttpStoreClient();
	};
	
	Index.prototype._getIndexDef = function(){
		var indexes = this._store._getStoreDef()["indexes"];
		if(indexes) {
			var index = indexes[this._name];
			if(index) {
				return index;
			}
		}
		throw new jstore.JsonException("Cannot find index {0} in store {1} in database {2}",this._name,this._store._name,this._store._database._name);
	};
	
	Index.prototype.getSession = function() {
		return this._store.getSession(); 
	};
	
	Index.prototype.getDatabase = function() {
		return this._store.getDatabase(); 
	};
	
	Index.prototype.getStore = function() {
		return this._store;
	};
	
	Index.prototype.getId = function() {
		return this._name; 
	};
	
	Index.prototype.getLabel = function() {
		return this._getIndexDef()["label"];
	};
	
	Index.prototype.getCategoryCount = function() {
		return this._getIndexDef()["categoryCount"];
	};
	
	Index.prototype.deleteAllDocuments = function(options,before){
		 return this.getHttpStoreClient().deleteAllDocuments(this._store._database._name,this._store._name,this._name,options,before);
	};
		
	Index.prototype.openCursor = function() {
		return new jstore._RemoteCursor(this._store,this);
	};
	
	jstore._RemoteIndex = Index;
});

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

darwino.provide("darwino/jstore/remote/instance",null,function() {

	var jstore = darwino.install("jstore");

	function Instance(id) {
		this._id = id || "";
	}
	
	Instance.prototype.getId = function() {
		return this._id;
	};

	jstore._RemoteInstance = Instance;
});

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

darwino.provide("darwino/jstore/remote/session",null,function() {

	var jstore = darwino.install("jstore");

	function Session(client,application,instance) {
		this._client = client;
		this._application = application;
		this._instance = instance;
		this._databases = {};
	}
	
	Session.prototype.getHttpStoreClient = function() {
		return this._client;
	};
	
	Session.prototype.clone = function() {
		return new Session(this.getHttpStoreClient(),this._application);
	};
	
	Session.prototype.close = function(){
		// Ok, nothing...
	};
	
	Session.prototype.notifyChanges = function(){
		// Ok, nothing...
	};

	Session.prototype.getInstanceId = function() {
		return this._instance;
	};
	
	Session.prototype.releaseConnections = function(){
		// Ok, nothing...
	};
	
	Session.prototype.isRemote = function() {
		return true;
	};
	
	Session.prototype.isAsync = function() {
		return this.getHttpStoreClient().isAsync();
	};
		
	Session.prototype.toJson = function(value,compact) {
		return darwino.Utils.toJson(value,(arguments.length==2)?compact:true);
	};
	
	Session.prototype.fromJson = function(json) {
		return darwino.Utils.fromJson(json);
	};
		
	//
	// Execution environment
	//
	Session.prototype.getUser = function() {
		if(!this._user) {
			this._user = this.getHttpStoreClient().getUserImpl();
		}
		return this._user;
	};
	
	Session.prototype.isSecurityEnabled = function() {
		// remote security is always enabled
		return true;
	};
		
	//
	// Transaction management
	//
	Session.prototype.supportTransaction = function() {
		return false;
	};
	Session.prototype.startTransaction = function() {
		//Ok, just nothing
	};
	Session.prototype.commitTransaction = function() {
		//Ok, just nothing
	};
	Session.prototype.abortTransaction = function() {
		throw new jstore.JsonException("An HTTP transaction cannot be aborted!");
	};
	Session.prototype.endTransaction = function(label) {
		//Ok, just nothing
	};

	//
	// Access to the databases
	//
	Session.prototype.getDatabase = function(name,instance) {
		var client;
		if(instance==undefined) {
			instance = this._instance;
			client = this._client;
		} else {
			client = new jstore._HttpStoreClient(this._client.getHttpClient(),instance);
		}
		var inst = this._application._createInstance(instance); 
		return new jstore._RemoteDatabase(this,client,name,inst);
	};
	
	//
	// Access to the physical databases
	//
	Session.prototype.getDatabaseList = function() {
		return this.getHttpStoreClient().getDatabaseList();
	};
	Session.prototype.databaseExists = function(name) {
		var databases = this.getHttpStoreClient().getDatabaseList();
		for(var i=0; i<databases.length; i++) {
			if(darwino.Utils.equalsIgnoreCase(databases[i],name)) {
				return true;
			}
		}
		return false;
	};
	Session.prototype.deployDatabase = function(name, version, meta, force) {
		if(darwino.Utils.isString(meta)) {
			meta = darwino.Utils.fromJson(meta);
		}
		this.getHttpStoreClient().deployDatabase(name, version, meta, force);
	};
	Session.prototype.undeployDatabase = function(name) {
		this.getHttpStoreClient().undeployDatabase(name);
	};
	Session.prototype.resetDatabase = function(name) {
		this.getHttpStoreClient().resetDatabase(name);
	};

	//
	// UrlBuilder
	// 
	Session.prototype.getUrlBuilder = function() {
		return this._application._urlBuilder;
	};
	
	//
	// Access to an attachment
	//
	Session.prototype.readAttachment = function(database, store, unid, attachmentName) {
		return this.getHttpStoreClient().readAttachmentStream(database, store, unid, attachmentName);
	};

	jstore._RemoteSession = Session;
});

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

darwino.provide("darwino/jstore/remote/store",null,function() {

	var jstore = darwino.install("jstore");

	function Store(database,name) {
		this._database = database;
		this._name = name;
		this._social = {};
	}

	Store.prototype.getHttpStoreClient = function() {
		return this._database.getHttpStoreClient();
	};

	Store.prototype._getStoreDef = function(){
		var stores = this._database._getDatabaseDef()["stores"];
		if(stores) {
			var store = stores[this._name];
			if(store) {
				return store;
			}
		}
		throw new jstore.JsonException("Cannot find store {0} in database {1}",this._name,this._database._id);
	};
	
	Store.prototype.getSession = function(){
		return this._database._session;
	};
	
	Store.prototype.getDatabase = function(){
		return this._database;
	};
	
	Store.prototype.getId = function(){
		return this._getStoreDef()["id"];
	};
	
	Store.prototype.getLabel = function(){
		return this._getStoreDef()["label"];
	};
	
	Store.prototype.isFtSearchEnabled = function(){
		return this._getStoreDef()["fulltextEnabled"] && this._database.isFtSearchEnabled();
	};
	
	Store.prototype.isTaggingEnabled = function(){
		return this._getStoreDef()["taggingEnabled"];
	};
	
	Store.prototype.isReadMarkEnabled = function(){
		return this._getStoreDef()["readMarkEnabled"];
	};
	
	Store.prototype.deleteDocument = function(unid,options){
		 return this.getHttpStoreClient().deleteDocument(this._database._name,this._name,unid,options);
	};
	
	Store.prototype.deleteAllDocuments = function(options,before){
		 return this.getHttpStoreClient().deleteAllDocuments(this._database._name,this._name,null,options,before);
	};
	
	Store.prototype.documentExists = function(unid){
		return this.getHttpStoreClient().documentExists(this._database._name,this._name,unid)["exists"];
	};
	
	Store.prototype.documentExistsByIndex = function(indexName,key){
		return this.getHttpStoreClient().documentExistsByIndex(this._database._name,this._name,indexName,key)["exists"];
	};
	
	Store.prototype.documentDeleted = function(unid){
		return this.getHttpStoreClient().documentDeleted(this._database._name,this._name,unid)["deleted"];
	};
	
	Store.prototype.documentCount = function(){
		return this.getHttpStoreClient().documentCount(this._database._name,this._name)["count"];
	};
	Store.prototype.getDocuments = function() {
		return this.getHttpStoreClient().getDocuments(this._database._name, this._name);
	};
	
	Store.prototype.childrenCount = function(unid){
		return this.getHttpStoreClient().childrenCount(this._database._name,this._name,unid)["count"];
	};
	Store.prototype.getChildren = function(unid) {
		return this.getHttpStoreClient().getChildren(this._database._name, this._name, unid);
	};
	Store.prototype.getSyncSlaves = function(unid) {
		return this.getHttpStoreClient().getSyncSlaves(this._database._name, this._name, unid);
	};
	
	Store.prototype.newDocument = function(unid){
		if(!unid) {
			unid = darwino.Utils.uuid();
		}
		return new jstore._RemoteDocument(this,unid);
	};
	
	Store.prototype.loadDocument = function(unid,options,handler){
		var json = this.getHttpStoreClient().loadDocument(this._database._name,this._name,unid,options);
		var doc = new jstore._RemoteDocument(this,unid);
		doc.updateJson(json);
		this.clearSocialDataCache(doc.getUnid());
		if(handler) {
			handler.handle(doc);
		} else {
			return doc;
		}
	};
	
	Store.prototype.loadDocumentByIndex = function(indexName,key,options,handler){
		var json = this.getHttpStoreClient().loadDocumentByIndex(this._database._name,this._name,indexName,key,options);
		var doc = new jstore._RemoteDocument(this,this.unid);
		doc.updateJson(json);
		this.clearSocialDataCache(doc.getUnid());
		if(handler) {
			handler.handle(doc);
		} else {
			return doc;
		}
	};
	
	Store.prototype.getTags = function(maxTags,sortByName){
		 return this.getHttpStoreClient().getTags(this._database._name,this._name,maxTags,sortByName);
	};
	
	Store.prototype.clearSocialDataCache = function(unid){
		if(unid) {
			delete this._social[unid];
		} else {
			this._social = {};
		}
	};
	
	Store.prototype.isShared = function(unid,userName){
		return this._getSocialData(unid,userName).share;
	};
	Store.prototype.share = function(unid,share,userName){
		var o = this.getHttpStoreClient().updateSocialData(this._database._name,this._name,unid,share,null,null,userName);
		this._updateAggregatedData(unid, userName, o);
	};
	Store.prototype.getShareCount = function(unid){
		return this._getSocialData(unid,null).shareCount;
	};
	
	Store.prototype.getRate = function(unid,userName){
		return this._getSocialData(unid,userName).rate;
	};
	Store.prototype.rate = function(unid,rate,userName){
		var o = this.getHttpStoreClient().updateSocialData(this._database._name,this._name,unid,null,null,rate,userName);
		this._updateAggregatedData(unid, userName, o);
	};
	Store.prototype.getRateAvg = function(unid){
		return this._getSocialData(unid,null).rateAvg;
	};
	
	Store.prototype.isRead = function(unid,userName){
		return this._getSocialData(unid,userName).read;
	};
	Store.prototype.markRead = function(unid,read,userName){
		var o = this.getHttpStoreClient().updateSocialData(this._database._name,this._name,unid,null,read,null,userName);
		this._updateAggregatedData(unid, userName, o);
	};
	Store.prototype.getReadCount = function(unid){
		return this._getSocialData(unid,null).readCount;
	};

	Store.prototype.openCursor = function(startKey,endKey){
		return new jstore._RemoteCursor(this,null);
	};

	Store.prototype.indexExists = function(name){
		var indexes = this._getStoreDef()["indexes"];
		return indexes && indexes[name];
	}	;
	Store.prototype.getIndexList = function(name){
		var indexes = this._getStoreDef()["indexes"];
		if(indexes) {
			var names = [];
			for(var n in indexes) {
				names.push(n);
			}
			return names;
		}
		return [];
	};
	Store.prototype.getIndex = function(name){
		return new jstore._RemoteIndex(this,name);
	};

	Store.prototype._getSocialData = function(unid,userName) {
		var currentUser = this._isCurrentUser(userName);
		if(currentUser && this._social) {
			var data = this._social[unid];
			if(data) {
				return data;
			}
		}
		var o = this.getHttpStoreClient().getSocialData(this._database._name,this._name,unid,userName);
		return this._updateAggregatedData(unid, userName, o);
	};
	Store.prototype._updateAggregatedData = function(unid,userName,o) {
		var currentUser = this._isCurrentUser(userName);
		var data;
		if(currentUser) {
			data = this._social[unid];
			if(!data) {
				data = {};
				this._social[unid]=data;
			}
		} else {
			data = {};
		}
		
		// Update the social data for the user
		data.read = o["read"];
		data.share = o["share"];
		data.rate = o["rate"];
		
		// Update the aggregated data, for the current session user
		var cdata = this._social[unid];
		if(cdata) {
			cdata.readCount = o["readCount"];
			cdata.shareCount = o["shareCount"];
			cdata.rateAvg = o["rateAvg"];
		}

		return data;
	};
	Store.prototype._isCurrentUser = function(userName) {
		if(!userName) {
			return true;
		}
		var u = this.getSession().getUser();
		if(!u.isAnonymous()) {
			if(!userName || userName==u.getDistinguishedName()) {
				return true;
			}
		}
		return false;
	};
	
	jstore._RemoteStore = Store;
});

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

darwino.provide("darwino/jstore/remote/usercontext",null,function() {

	var jstore = darwino.install("jstore");

	function UserContext(user,securityEnabled,entryNames) {
		this._user = user;
		this._securityEnabled = securityEnabled;
		this._entries = {};
		if(entryNames) {
			for(var i=0; i<entryNames.length; i++) {
				this._entries[entryNames[i]] = true;
			}
		}
	}

	UserContext.PEOPLE_PREFIX 			= "p:";
	UserContext.GROUP_PREFIX 			= "g:";
	UserContext.ROLE_PREFIX 			= "r:";


	UserContext.prototype.getUser = function(){
		return this._user;
	};

	UserContext.prototype.isSecurityEnabled = function(){
		return this._securityEnabled;
	};

	UserContext.prototype.getEntryNames = function(){
		var a = new Array();
		for(var p in this._entries) {
			a.push(p);
		}
		return a;
	};

	UserContext.prototype.hasEntry = function(id){
		return this._entries[id]==true;
	};

	UserContext.prototype.hasUserId = function(id){
		return this._hasEntry(PEOPLE_PREFIX+id);
	};

	UserContext.prototype.hasGroup = function(id){
		return this._hasEntry(GROUP_PREFIX+id);
	};

	UserContext.prototype.hasRole = function(id){
		return this._hasEntry(ROLE_PREFIX+id);
	};

	jstore._RemoteUserContext = UserContext;
});

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

darwino.provide("darwino/libs/base64",null,function() {

	var utils = darwino.install("Utils");

/*
 * Copyright (c) 2010 Nick Galbreath
 * http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* base64 encode/decode compatible with window.btoa/atob
 *
 * window.atob/btoa is a Firefox extension to convert binary data (the "b")
 * to base64 (ascii, the "a").
 *
 * It is also found in Safari and Chrome.  It is not available in IE.
 *
 * if (!window.btoa) window.btoa = base64.encode
 * if (!window.atob) window.atob = base64.decode
 *
 * The original spec's for atob/btoa are a bit lacking
 * https://developer.mozilla.org/en/DOM/window.atob
 * https://developer.mozilla.org/en/DOM/window.btoa
 *
 * window.btoa and base64.encode takes a string where charCodeAt is [0,255]
 * If any character is not [0,255], then an DOMException(5) is thrown.
 *
 * window.atob and base64.decode take a base64-encoded string
 * If the input length is not a multiple of 4, or contains invalid characters
 *   then an DOMException(5) is thrown.
 */
var base64 = {};
base64.PADCHAR = '=';
base64.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

base64.makeDOMException = function() {
    // sadly in FF,Safari,Chrome you can't make a DOMException
    var e, tmp;

    try {
        return new DOMException(DOMException.INVALID_CHARACTER_ERR);
    } catch (tmp) {
        // not available, just passback a duck-typed equiv
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error/prototype
        var ex = new Error("DOM Exception 5");

        // ex.number and ex.description is IE-specific.
        ex.code = ex.number = 5;
        ex.name = ex.description = "INVALID_CHARACTER_ERR";

        // Safari/Chrome output format
        ex.toString = function() { return 'Error: ' + ex.name + ': ' + ex.message; };
        return ex;
    }
};

base64.getbyte64 = function(s,i) {
    // This is oddly fast, except on Chrome/V8.
    //  Minimal or no improvement in performance by using a
    //   object with properties mapping chars to value (eg. 'A': 0)
    var idx = base64.ALPHA.indexOf(s.charAt(i));
    if (idx === -1) {
        throw base64.makeDOMException();
    }
    return idx;
};

base64.decode = function(s) {
    // convert to string
    s = '' + s;
    var getbyte64 = base64.getbyte64;
    var pads, i, b10;
    var imax = s.length;
    if (imax === 0) {
        return s;
    }

    if (imax % 4 !== 0) {
        throw base64.makeDOMException();
    }

    pads = 0;
    if (s.charAt(imax - 1) === base64.PADCHAR) {
        pads = 1;
        if (s.charAt(imax - 2) === base64.PADCHAR) {
            pads = 2;
        }
        // either way, we want to ignore this last block
        imax -= 4;
    }

    var x = [];
    for (i = 0; i < imax; i += 4) {
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) |
            (getbyte64(s,i+2) << 6) | getbyte64(s,i+3);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
    }

    switch (pads) {
    case 1:
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) | (getbyte64(s,i+2) << 6);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
        break;
    case 2:
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12);
        x.push(String.fromCharCode(b10 >> 16));
        break;
    }
    return x.join('');
};

base64.getbyte = function(s,i) {
    return s.charCodeAt(i) & 0xff;
};

base64.encode = function(s) {
    if (arguments.length !== 1) {
        throw new SyntaxError("Not enough arguments");
    }
    var padchar = base64.PADCHAR;
    var alpha   = base64.ALPHA;
    var getbyte = base64.getbyte;

    var i, b10;
    var x = [];

    // convert to string
    s = '' + s;

    var imax = s.length - s.length % 3;

    if (s.length === 0) {
        return s;
    }
    for (i = 0; i < imax; i += 3) {
        b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8) | getbyte(s,i+2);
        x.push(alpha.charAt(b10 >> 18));
        x.push(alpha.charAt((b10 >> 12) & 0x3F));
        x.push(alpha.charAt((b10 >> 6) & 0x3f));
        x.push(alpha.charAt(b10 & 0x3f));
    }
    switch (s.length - imax) {
    case 1:
        b10 = getbyte(s,i) << 16;
        x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
               padchar + padchar);
        break;
    case 2:
        b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8);
        x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
               alpha.charAt((b10 >> 6) & 0x3f) + padchar);
        break;
    }
    return x.join('');
};

utils.btoa = base64.encode;
utils.atob = base64.decode;
});

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

darwino.provide("darwino/libs/binary",null,function() {

	var utils = darwino.install("Utils");
	
	// Basic interface using strings
	// Should have an implementation using byte arrays in modern browsers
	
	function Binary(mimeType,content,length) {
		this._mimeType = mimeType;
		if(content) {
			this._content = content;
			this._length = length!=undefined ? length : content.length;
		} else {
			this._content = null;
			this._length = 0;
		}
	}

	Binary.prototype.getLength = function() {
		return this._length;
	};
	
	Binary.prototype.getMimeType = function() {
		return this._mimeType;
	};
	
	Binary.prototype.getAsBinaryString = function() {
		return this._content;
	};

	Binary.prototype.getAsBase64 = function() {
		return this._content ? utils.btoa(this._content) : null;
	};
	
	// Use a factory to abstract the real implementation
	utils.createBinaryContent = function(mimeType,content,length) {
		return new Binary(mimeType,content,length);
	};
});

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

//
// Simple Class implementation for JavaScript
// See: http://ejohn.org/blog/simple-javascript-inheritance/
//
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function() {
	var initializing = false, fnTest = /xyz/.test(function() {
		xyz;
	}) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	this.Class = function() {
	};

	// Create a new Class that inherits from this class
	Class.extend = function(prop) {
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for ( var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function"
					&& typeof _super[name] == "function"
					&& fnTest.test(prop[name]) ? (function(name, fn) {
				return function() {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply(this, arguments);
					this._super = tmp;

					return ret;
				};
			})(name, prop[name]) : prop[name];
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};
})();

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

darwino.provide("darwino/libs/jsonpath",null,function() {

	var utils = darwino.install("Utils");

/* JSONPath 0.8.0 - XPath for JSON
 *
 * Copyright (c) 2007 Stefan Goessner (goessner.net)
 * Licensed under the MIT (MIT-LICENSE.txt) licence.
 */
function jsonPath(obj, expr, arg) {
   var P = {
      resultType: arg && arg.resultType || "VALUE",
      result: [],
      normalize: function(expr) {
         var subx = [];
         return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0,$1){return "[#"+(subx.push($1)-1)+"]";})
                    .replace(/'?\.'?|\['?/g, ";")
                    .replace(/;;;|;;/g, ";..;")
                    .replace(/;$|'?\]|'$/g, "")
                    .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
      },
      asPath: function(path) {
         var x = path.split(";"), p = "$";
         for (var i=1,n=x.length; i<n; i++)
            p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
         return p;
      },
      store: function(p, v) {
         if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
         return !!p;
      },
      trace: function(expr, val, path) {
         if (expr) {
            var x = expr.split(";"), loc = x.shift();
            x = x.join(";");
            if (val && val.hasOwnProperty(loc))
               P.trace(x, val[loc], path + ";" + loc);
            else if (loc === "*")
               P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
            else if (loc === "..") {
               P.trace(x, val, path);
               P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
            }
            else if (/,/.test(loc)) { // [name1,name2,...]
               for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
                  P.trace(s[i]+";"+x, val, path);
            }
            else if (/^\(.*?\)$/.test(loc)) // [(expr)]
               P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
            else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
               P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) P.trace(m+";"+x,v,p); });
            else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
               P.slice(loc, x, val, path);
         }
         else
            P.store(path, val);
      },
      walk: function(loc, expr, val, path, f) {
         if (val instanceof Array) {
            for (var i=0,n=val.length; i<n; i++)
               if (i in val)
                  f(i,loc,expr,val,path);
         }
         else if (typeof val === "object") {
            for (var m in val)
               if (val.hasOwnProperty(m))
                  f(m,loc,expr,val,path);
         }
      },
      slice: function(loc, expr, val, path) {
         if (val instanceof Array) {
            var len=val.length, start=0, end=len, step=1;
            loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
            start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
            end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
            for (var i=start; i<end; i+=step)
               P.trace(i+";"+expr, val, path);
         }
      },
      eval: function(x, _v, _vname) {
         try { return $ && _v && eval(x.replace(/@/g, "_v")); }
         catch(e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
      }
   };

   var $ = obj;
   if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
      P.trace(P.normalize(expr).replace(/^\$;/,""), obj, "$");
      return P.result.length ? P.result : false;
   }
} 

utils.jsonPath = jsonPath;

});

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

darwino.provide("darwino/libs/promise",null,function() {

	var utils = darwino.install("Utils");

	//
	// Simple Promise implementation
	//
	function Promise(response) {
		this._isRejected=false;
		this._isFulfilled=false,
		this._isCanceled=false;
		this._deferreds=null;
		this.response=null;
		this.error=null;
        if (response) {
            if (response instanceof Error) {
                this.rejected(response);
            } else {
                this.fulfilled(response);
            }
        } else {
            this._deferreds = [];
        }
	}
	
	Promise.prototype.then = function(fulfilledHandler, errorHandler) {
    	var promise = new Promise();
        if (this._isFulfilled) {
        	this._fulfilled(fulfilledHandler, errorHandler, promise, this.data);
        } else if (this._isRejected) {
        	this._rejected(errorHandler, promise, this.error);
        } else {
            this._deferreds.push([ fulfilledHandler, errorHandler, promise ]);
        }
        return promise;
    };

    Promise.prototype.cancel = function(reason, strict) {
        this._isCanceled = true;
    };

    Promise.prototype.isResolved = function() {
        return this._isRejected || this._isFulfilled;
    };

    Promise.prototype.isRejected = function() {
        return this._isRejected;
    };

    Promise.prototype.isFulfilled = function() {
        return this._isFulfilled;
    };

    Promise.prototype.isCanceled = function() {
        return this._isCanceled;
    };

    Promise.prototype.fulfilled = function(data) {
        if (this._isCanceled) {
            return;
        }
        
        this._isFulfilled = true;
        this.data = data;
        
        if (this._deferreds) {
            while (this._deferreds.length > 0) {
                var deferred = this._deferreds.shift();
                var fulfilledHandler = deferred[0];
                var errorHandler = deferred[1];
                var promise = deferred[2];
            	this._fulfilled(fulfilledHandler, errorHandler, promise, data);
            }
        }
    };
    
    Promise.prototype.rejected = function(error) {
        if (this._canceled) {
            return;
        }
        
        this._isRejected = true;
        this.error = error;
        
        if (this._deferreds) {
            while (this._deferreds.length > 0) {
                var deferred = this._deferreds.shift();
                var errorHandler = deferred[1];
                var promise = deferred[2];
            	this._rejected(errorHandler, promise, error);
            }
        }
    };
    
    Promise.prototype._fulfilled = function(fulfilledHandler, errorHandler, promise, data) {
        if (fulfilledHandler) {
        	try {
            	var retval = fulfilledHandler(data);
            	if (retval instanceof Promise) {
            		retval.then(
            			function(data) {
            				promise.fulfilled(data);
            			},
            			function(error) {
            				promise.rejected(error);
            			}
            		);
            	} else {
            		promise.fulfilled(retval);
            	}
        	} catch (error) {
        		promise.rejected(error);
        	}
        } else {
        	promise.fulfilled(data);
        }
    };
    
    Promise.prototype._rejected = function(errorHandler, promise, error) {
        if (errorHandler) {
        	try {
            	var retval = errorHandler(error);
            	if (!retval) {
            		// stop propagating errors
            		promise.rejected(retval);
            	}
        	} catch (error1) {
        		promise.rejected(error1);
        	}
        } else {
        	promise.rejected(error);
        }
    };
	
	utils.promise = function(response) {
		return new Promise(response);
	}
});

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

darwino.provide("browser/jsonhttpclient",null,function() {

	var utils = darwino.install("Utils");
	
	function convertEmpty(xhr) {
		return null;
	}
	function convertText(xhr) {
		return xhr.responseText;
	}
	function convertJson(xhr) {
		return utils.fromJson(xhr.responseText);
	}
	function convertXml(xhr) {
		return utils.parseXml(xhr.responseText);
	}
	
	function findConvert() {
		var ct = this.getResponseHeader('content-type');
		if(ct=='application/json') {
			return convertJson;
		}
		if(ct=='application/xml') {
			return convertXml;
		}
		return convertText;
	}

	function JsonHttpClient(url,userName,password) {
		this.USE_HTTP_OVERRIDE = false;
		this.async = false;
		this._url = url;
		this._userName = userName || null;
		this._password = password || null;
	}
	
	JsonHttpClient.prototype.isError = function(status,xhr) {
		return status!=200;
	}

	JsonHttpClient.prototype._makeUrl = function(params,parts) {
		var url = this._url;
		// Add the URL parts
		if(parts && parts.length) {
			var p = parts.join("/");
			url = utils.concatPath(url,p);
		}
		// Add the query string
		if(params) {
			var qs = "";
			for(var pa in params) {
				var v = params[pa].toString();
				qs += (qs ? '&' : "?") + encodeURIComponent(pa) + (v ? ('=' + encodeURIComponent(v)) : "");
			}
			url = utils.removeTrailingSep(url) + qs;
		}
		return url;
	};

	JsonHttpClient.prototype._ajax = function(method,parts,params,contentType,content,cb,convert,mime) {
		var client = this;
		var headers = {};
		if(this.USE_HTTP_OVERRIDE && (method=="PUT" || method=="DELETE")) {
			headers["x-http-method-override"] = method;
			method = "POST";
		}
		if(this.async && !cb) {
			throw new Error("Empty callback parameter while executing an asynchronous request");
		}
		var url = this._makeUrl(params,parts);
		var xhr = new XMLHttpRequest();
		xhr.open(method,url,this.async,this.userName,this.password);
		xhr.onreadystatechange = function() {
			// http://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
			if (xhr.readyState == 4 && cb) {
				if(client.isError(xhr.status,xhr)) {
					if(cb.failure){cb.failure(findConvert(xhr)(xhr),xhr);}
				} else {
					(cb.success||cb)((convert||findConvert(xhr))(xhr),xhr);
				}
			}
		};
		if(mime) {
			xhr.overrideMimeType(mime);
		}
  		if(content) {
  			if(contentType) {
  				xhr.setRequestHeader("Content-Type", contentType);
  			}
			xhr.send(content);
		} else {
			xhr.send();
		}
  		if(!this.async && !cb) {
			if(client.isError(xhr.status,xhr)) {
				throw new Error("Error "+xhr.status+" while executing synchronous request");
			} else {
				return (convert||findConvert(xhr))(xhr);
			}
		}
		return null;
	};

	
	JsonHttpClient.prototype.getAsEmpty = function(parts,params,cb) {
		return this._ajax('GET',parts,params,null,null,cb,convertEmpty);
	};
	JsonHttpClient.prototype.getAsText = function(parts,params,cb) {
		return this._ajax('GET',parts,params,null,null,cb,convertText);
	};
	JsonHttpClient.prototype.getAsJson = function(parts,params,cb) {
		return this._ajax('GET',parts,params,null,null,cb,convertJson);
	};
	JsonHttpClient.prototype.getAsXml = function(parts,params,cb) {
		return this._ajax('GET',parts,params,null,null,cb,convertXml);
	};
	JsonHttpClient.prototype.getAsBinaryString = function(parts,params,cb) {
		return this._ajax('GET',parts,params,null,null,cb,convertText,'text\/plain; charset=x-user-defined')
	};
	
	JsonHttpClient.prototype.deleteAsEmpty = function(parts,params,cb) {
		return this._ajax('DELETE',parts,params,null,null,cb,convertEmpty);
	};
	JsonHttpClient.prototype.deleteAsJson = function(parts,params,cb) {
		return this._ajax('DELETE',parts,params,null,null,cb,convertJson);
	};
	
	JsonHttpClient.prototype.putJsonAsJson = function(parts,params,content,cb) {
		return this._ajax('PUT',parts,params,'application/json',utils.toJson(content),cb,convertJson);
	};
	JsonHttpClient.prototype.putEmptyAsJson = function(parts,params,cb) {
		return this._ajax('PUT',parts,params,null,null,cb,convertJson);
	};
	
	JsonHttpClient.prototype.postJsonAsEmpty = function(parts,params,content,cb) {
		return this._ajax('POST',parts,params,'application/json',utils.toJson(content),cb,convertEmpty);
	};
	JsonHttpClient.prototype.postJsonAsJson = function(parts,params,content,cb) {
		return this._ajax('POST',parts,params,'application/json',utils.toJson(content),cb,convertJson);
	};
	
	utils._JsonHttpClient = JsonHttpClient;	
});

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

darwino.provide("hybrid/hybrid",null,function() {

	var platform = 0;
	if(navigator) {
		// TODO: use a custom user agent in iOS
		var userAgent = navigator.userAgent;
		if(/DarwinoHybrid\/[0-9\.]+ Android$/.test(userAgent)) {
			platform = 1;
		} else if(/DarwinoHybrid\/[0-9\.]+ iOS$/.test(userAgent)) {
			platform = 2;
		}
	}
	
	var settingsListeners = [];
	
	darwino.install("hybrid", {
		_settings: null,
		_init: function() {
			this._settings = (platform>0 && this.exec("readSettings")) || {mode:0, dirty:false};
		},
		
		isHybrid: function() {
			return platform>0;
		},
		isHybridAndroid: function() {
			return platform==1;
		},
		isHybridIos: function() {
			return platform==2;
		},
		setSettingsValue: function(key,value) {
			// Run that lately as this is called by the native code and can be in a different thread
			// setTimeout() ensure that it will happen in the browser UI thread
			var _this = this;
			setTimeout(function() {
				_this._settings[key] = value;
				for(var i=0; i<settingsListeners.length; i++) {
					settingsListeners[i](key);
				}
			});
		},
		addSettingsListener: function(l) {
			settingsListeners.push(l);
		},
		
		getProperty: function(key) {
			return this._settings.props[key];
		},
		getMode: function() {
			return this._settings.mode;
		},
		isDirty: function() {
			return this._settings.dirty;
		},
		setDirty: function(dirty) {
			this._settings.dirty = dirty;
		},
		
		exec: function(verb,args,cb,async) {
			args = args || {};
			if(platform==1 && !async) {
				return this._execDirect(verb,args,cb,async);
			} else {
				return this._execHttp(verb,args,cb,async);
			}
		},
		_execHttp: function(verb,args,cb,async) {
			var url = "$darwino-hybrid/rpc/"+encodeURI(verb);
			var jsonClient = new darwino.Utils._JsonHttpClient(url);
			if(async) jsonClient.async = true; 
			return jsonClient.postJsonAsJson(null,null,args); // Args are past as part of the body
		},
		_execDirect: function(verb,args,cb,async) {
			var p = {
				verb: verb,
				args: args
			};
			if(platform==1) { // Android
				var res = JSON.parse(window.dwohybrid.exec(JSON.stringify(p)));
				if(res.status!=200) {
					throw new Error("Hybrid Call Error="+res.status+"\nMessage:"+res.message);
				}
				return res.content;
			} else if(platform==2) { // iOS
				throw new Error("Not Implemented yet on iOS!");
			} else { // others
				throw new Error("Unknown hybrid platform "+platform);
			} 
		},
		
		
		//
		// Standard actions
		//
		refreshData: function() {
			if(this.isHybrid()) {
				this.exec("refreshData");
			} else {
				location.reload();
			}
		},
		switchToLocal: function() {
			this.exec("switchToLocal");
		},
		switchToRemote: function() {
			this.exec("switchToRemote");
		},
		switchToWeb: function() {
			this.exec("switchToWeb");
		},
		createLocalData: function() {
			this.exec("createLocalData");
		},
		recreateLocalData: function() {
			this.exec("recreateLocalData");
		},
		deleteLocalData: function() {
			this.exec("deleteLocalData");
		},
		synchronizeData: function() {
			this.exec("synchronizeData");
		},
		eraseLocalData: function() {
			this.exec("eraseLocalData");
		},
		deleteLocalSqliteFile: function() {
			this.exec("deleteLocalSqliteFile");
		},
		startApplication: function(name) {
			this.exec("startApplication",{name:name});
		},
		openSettings: function() {
			this.exec("openSettings");
		}
	});
	
	darwino.hybrid._init();
});

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

darwino.provide("darwino/social/social",null,function() {
	
	var social = darwino.install("social");
});

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

darwino.provide("darwino/social/profiles",null,function() {
	
	var social = darwino.install("social");
	var user = null;
	
	var requests = {};
	
	function ProfilesService(baseUrl) {
		this.profiles = {};
		this.baseUrl = baseUrl;
		this.jsonClient = new darwino.Utils._JsonHttpClient(baseUrl);
		// We retrieve the profiles asynchronously, by default
		this.jsonClient.async = true;
	}

	ProfilesService.prototype.isAnonymous = function() {
		return this.getProfile("@me").id=="anonymous";
	}
	
	ProfilesService.prototype.isUnknown = function() {
		return this.getProfile("@me").id=="unknown";
	}
	
	ProfilesService.prototype.getCurrentUser = function(cb) {
		if(!user) {
			user = {dn:"unknown",cn:"Unknown"};
			this.jsonClient.getAsJson(["user"], function(json) {
				user = json; 
				if(cb) cb();
			})
		}
		return user;
	}
	
	ProfilesService.prototype.getProfile = function(id,cb) {
		var p;  var _this=this;
		// An ID is case insensitive
		if(id) {
			id = id.toLowerCase();
			p = _this.profiles[id];
			if(!p) {
				// the current profile is a default one, until we get the result back from the server
				// if async is set, then this will come later and the callback will notify the first caller when done
				_this.profiles[id] = {id:id,cn:id};
				_this.jsonClient.getAsJson(["profile"],{id:id}, function(json) {
					_this.profiles[id] = _this.profiles[json.id.toLowerCase()] = json;
					if(json.email) {
						_this.profiles[json.email.toLowerCase()] = json;
					}
					// The callback function is called when the data comes back from the server
					if(cb) cb();
				});
				p = _this.profiles[id]; // for sync changes... 
			}
		} else {
			p = {id:"anonymous",cn:"Anonymous"};
		}
		return p||null;
	}

	ProfilesService.prototype.getProfilePhotoUrl = function(id) {
		return this.getProfileDataUrl(id,"photo");
	}
	
	ProfilesService.prototype.getProfileDataUrl = function(id,type) {
		if(id) {
			return this.baseUrl + "/profiledata?" + "id=" + encodeURIComponent(id) + (type?"&type="+encodeURIComponent(type):"");
		}
		return null;
	}

	social.createProfilesService = function(baseUrl) {
		return new ProfilesService(baseUrl);
	}
});

