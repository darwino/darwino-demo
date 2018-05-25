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

$(function(){$.widget("primeui.puifieldset",{options:{toggleable:false,toggleDuration:"normal",collapsed:false},_create:function(){this.element.addClass("pui-fieldset ui-widget ui-widget-content ui-corner-all").children("legend").addClass("pui-fieldset-legend ui-corner-all ui-state-default");
this.element.contents(":not(legend)").wrapAll('<div class="pui-fieldset-content" />');
this.legend=this.element.children("legend.pui-fieldset-legend");
this.content=this.element.children("div.pui-fieldset-content");
this.legend.prependTo(this.element);
if(this.options.toggleable){this.element.addClass("pui-fieldset-toggleable");
this.toggler=$('<span class="pui-fieldset-toggler ui-icon" />').prependTo(this.legend);
this._bindEvents();
if(this.options.collapsed){this.content.hide();
this.toggler.addClass("ui-icon-plusthick")
}else{this.toggler.addClass("ui-icon-minusthick")
}}},_bindEvents:function(){var a=this;
this.legend.on("click.puifieldset",function(b){a.toggle(b)
}).on("mouseover.puifieldset",function(){a.legend.addClass("ui-state-hover")
}).on("mouseout.puifieldset",function(){a.legend.removeClass("ui-state-hover ui-state-active")
}).on("mousedown.puifieldset",function(){a.legend.removeClass("ui-state-hover").addClass("ui-state-active")
}).on("mouseup.puifieldset",function(){a.legend.removeClass("ui-state-active").addClass("ui-state-hover")
})
},toggle:function(b){var a=this;
this._trigger("beforeToggle",b);
if(this.options.collapsed){this.toggler.removeClass("ui-icon-plusthick").addClass("ui-icon-minusthick")
}else{this.toggler.removeClass("ui-icon-minusthick").addClass("ui-icon-plusthick")
}this.content.slideToggle(this.options.toggleSpeed,"easeInOutCirc",function(){a._trigger("afterToggle",b);
a.options.collapsed=!a.options.collapsed
})
}})
});