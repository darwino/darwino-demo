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

$(function(){$.widget("primeui.puinotify",{options:{position:"top",visible:false,animate:true,effectSpeed:"normal",easing:"swing"},_create:function(){this.element.addClass("pui-notify pui-notify-"+this.options.position+" ui-widget ui-widget-content pui-shadow").wrapInner('<div class="pui-notify-content" />').appendTo(document.body);
this.content=this.element.children(".pui-notify-content");
this.closeIcon=$('<span class="ui-icon ui-icon-closethick pui-notify-close"></span>').appendTo(this.element);
this._bindEvents();
if(this.options.visible){this.show()
}},_bindEvents:function(){var a=this;
this.closeIcon.on("click.puinotify",function(){a.hide()
})
},show:function(a){var b=this;
if(a){this.update(a)
}this.element.css("z-index",++PUI.zindex);
this._trigger("beforeShow");
if(this.options.animate){this.element.slideDown(this.options.effectSpeed,this.options.easing,function(){b._trigger("afterShow")
})
}else{this.element.show();
b._trigger("afterShow")
}},hide:function(){var a=this;
this._trigger("beforeHide");
if(this.options.animate){this.element.slideUp(this.options.effectSpeed,this.options.easing,function(){a._trigger("afterHide")
})
}else{this.element.hide();
a._trigger("afterHide")
}},update:function(a){this.content.html(a)
}})
});