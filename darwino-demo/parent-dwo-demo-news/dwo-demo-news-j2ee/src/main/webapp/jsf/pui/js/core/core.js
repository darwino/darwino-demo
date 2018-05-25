/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
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

var PUI={zindex:1000,scrollInView:function(b,e){var h=parseFloat(b.css("borderTopWidth"))||0,d=parseFloat(b.css("paddingTop"))||0,f=e.offset().top-b.offset().top-h-d,a=b.scrollTop(),c=b.height(),g=e.outerHeight(true);
if(f<0){b.scrollTop(a+f)
}else{if((f+g)>c){b.scrollTop(a+f-c+g)
}}},isIE:function(a){return($.browser.msie&&parseInt($.browser.version,10)===a)
},escapeRegExp:function(a){return a.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")
},escapeHTML:function(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
},clearSelection:function(){if(window.getSelection){if(window.getSelection().empty){window.getSelection().empty()
}else{if(window.getSelection().removeAllRanges){window.getSelection().removeAllRanges()
}}}else{if(document.selection&&document.selection.empty){document.selection.empty()
}}},inArray:function(a,c){for(var b=0;
b<a.length;
b++){if(a[b]===c){return true
}}return false
}};