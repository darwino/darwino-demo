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

$(function(){$.widget("primeui.puiaccordion",{options:{activeIndex:0,multiple:false},_create:function(){if(this.options.multiple){this.options.activeIndex=[]
}var a=this;
this.element.addClass("pui-accordion ui-widget ui-helper-reset");
this.element.children("h3").addClass("pui-accordion-header ui-helper-reset ui-state-default").each(function(c){var f=$(this),e=f.html(),d=(c==a.options.activeIndex)?"ui-state-active ui-corner-top":"ui-corner-all",b=(c==a.options.activeIndex)?"ui-icon ui-icon-triangle-1-s":"ui-icon ui-icon-triangle-1-e";
f.addClass(d).html('<span class="'+b+'"></span><a href="#">'+e+"</a>")
});
this.element.children("div").each(function(b){var c=$(this);
c.addClass("pui-accordion-content ui-helper-reset ui-widget-content");
if(b!=a.options.activeIndex){c.addClass("ui-helper-hidden")
}});
this.headers=this.element.children(".pui-accordion-header");
this.panels=this.element.children(".pui-accordion-content");
this.headers.children("a").disableSelection();
this._bindEvents()
},_bindEvents:function(){var a=this;
this.headers.mouseover(function(){var b=$(this);
if(!b.hasClass("ui-state-active")&&!b.hasClass("ui-state-disabled")){b.addClass("ui-state-hover")
}}).mouseout(function(){var b=$(this);
if(!b.hasClass("ui-state-active")&&!b.hasClass("ui-state-disabled")){b.removeClass("ui-state-hover")
}}).click(function(d){var c=$(this);
if(!c.hasClass("ui-state-disabled")){var b=c.index()/2;
if(c.hasClass("ui-state-active")){a.unselect(b)
}else{a.select(b)
}}d.preventDefault()
})
},select:function(b){var a=this.panels.eq(b);
this._trigger("change",a);
if(this.options.multiple){this._addToSelection(b)
}else{this.options.activeIndex=b
}this._show(a)
},unselect:function(b){var a=this.panels.eq(b),c=a.prev();
c.attr("aria-expanded",false).children(".ui-icon").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
c.removeClass("ui-state-active ui-corner-top").addClass("ui-corner-all");
a.attr("aria-hidden",true).slideUp();
this._removeFromSelection(b)
},_show:function(b){if(!this.options.multiple){var c=this.headers.filter(".ui-state-active");
c.children(".ui-icon").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
c.attr("aria-expanded",false).removeClass("ui-state-active ui-corner-top").addClass("ui-corner-all").next().attr("aria-hidden",true).slideUp()
}var a=b.prev();
a.attr("aria-expanded",true).addClass("ui-state-active ui-corner-top").removeClass("ui-state-hover ui-corner-all").children(".ui-icon").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
b.attr("aria-hidden",false).slideDown("normal")
},_addToSelection:function(a){this.options.activeIndex.push(a)
},_removeFromSelection:function(a){this.options.activeIndex=$.grep(this.options.activeIndex,function(b){return b!=a
})
}})
});