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

$(function(){$.widget("primeui.puitooltip",{options:{showEvent:"mouseover",hideEvent:"mouseout",showEffect:"fade",hideEffect:null,showEffectSpeed:"normal",hideEffectSpeed:"normal",my:"left top",at:"right bottom",showDelay:150},_create:function(){this.options.showEvent=this.options.showEvent+".puitooltip";
this.options.hideEvent=this.options.hideEvent+".puitooltip";
if(this.element.get(0)===document){this._bindGlobal()
}else{this._bindTarget()
}},_bindGlobal:function(){this.container=$('<div class="pui-tooltip pui-tooltip-global ui-widget ui-widget-content ui-corner-all pui-shadow" />').appendTo(document.body);
this.globalSelector="a,:input,:button,img";
var b=this;
$(document).off(this.options.showEvent+" "+this.options.hideEvent,this.globalSelector).on(this.options.showEvent,this.globalSelector,null,function(){var c=$(this),d=c.attr("title");
if(d){b.container.text(d);
b.globalTitle=d;
b.target=c;
c.attr("title","");
b.show()
}}).on(this.options.hideEvent,this.globalSelector,null,function(){var c=$(this);
if(b.globalTitle){b.container.hide();
c.attr("title",b.globalTitle);
b.globalTitle=null;
b.target=null
}});
var a="resize.puitooltip";
$(window).unbind(a).bind(a,function(){if(b.container.is(":visible")){b._align()
}})
},_bindTarget:function(){this.container=$('<div class="pui-tooltip ui-widget ui-widget-content ui-corner-all pui-shadow" />').appendTo(document.body);
var b=this;
this.element.off(this.options.showEvent+" "+this.options.hideEvent).on(this.options.showEvent,function(){b.show()
}).on(this.options.hideEvent,function(){b.hide()
});
this.container.html(this.options.content);
this.element.removeAttr("title");
this.target=this.element;
var a="resize."+this.element.attr("id");
$(window).unbind(a).bind(a,function(){if(b.container.is(":visible")){b._align()
}})
},_align:function(){this.container.css({left:"",top:"","z-index":++PUI.zindex}).position({my:this.options.my,at:this.options.at,of:this.target})
},show:function(){var a=this;
this.timeout=window.setTimeout(function(){a._align();
a.container.show(a.options.showEffect,{},a.options.showEffectSpeed)
},this.options.showDelay)
},hide:function(){window.clearTimeout(this.timeout);
this.container.hide(this.options.hideEffect,{},this.options.hideEffectSpeed,function(){$(this).css("z-index","")
})
}})
});