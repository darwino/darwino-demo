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

$(function(){$.widget("primeui.puigalleria",{options:{panelWidth:600,panelHeight:400,frameWidth:60,frameHeight:40,activeIndex:0,showFilmstrip:true,autoPlay:true,transitionInterval:4000,effect:"fade",effectSpeed:250,effectOptions:{},showCaption:true,customContent:false},_create:function(){this.element.addClass("pui-galleria ui-widget ui-widget-content ui-corner-all");
this.panelWrapper=this.element.children("ul");
this.panelWrapper.addClass("pui-galleria-panel-wrapper");
this.panels=this.panelWrapper.children("li");
this.panels.addClass("pui-galleria-panel ui-helper-hidden");
this.element.width(this.options.panelWidth);
this.panelWrapper.width(this.options.panelWidth).height(this.options.panelHeight);
this.panels.width(this.options.panelWidth).height(this.options.panelHeight);
if(this.options.showFilmstrip){this._renderStrip();
this._bindEvents()
}if(this.options.customContent){this.panels.children("img").remove();
this.panels.children("div").addClass("pui-galleria-panel-content")
}var a=this.panels.eq(this.options.activeIndex);
a.removeClass("ui-helper-hidden");
if(this.options.showCaption){this._showCaption(a)
}this.element.css("visibility","visible");
if(this.options.autoPlay){this.startSlideshow()
}},_renderStrip:function(){var a='style="width:'+this.options.frameWidth+"px;height:"+this.options.frameHeight+'px;"';
this.stripWrapper=$('<div class="pui-galleria-filmstrip-wrapper"></div>').width(this.element.width()-50).height(this.options.frameHeight).appendTo(this.element);
this.strip=$('<ul class="pui-galleria-filmstrip"></div>').appendTo(this.stripWrapper);
for(var c=0;
c<this.panels.length;
c++){var e=this.panels.eq(c).children("img"),b=(c==this.options.activeIndex)?"pui-galleria-frame pui-galleria-frame-active":"pui-galleria-frame",d='<li class="'+b+'" '+a+'><div class="pui-galleria-frame-content" '+a+'><img src="'+e.attr("src")+'" class="pui-galleria-frame-image" '+a+"/></div></li>";
this.strip.append(d)
}this.frames=this.strip.children("li.pui-galleria-frame");
this.element.append('<div class="pui-galleria-nav-prev ui-icon ui-icon-circle-triangle-w" style="bottom:'+(this.options.frameHeight/2)+'px"></div><div class="pui-galleria-nav-next ui-icon ui-icon-circle-triangle-e" style="bottom:'+(this.options.frameHeight/2)+'px"></div>');
if(this.options.showCaption){this.caption=$('<div class="pui-galleria-caption"></div>').css({bottom:this.stripWrapper.outerHeight(true),width:this.panelWrapper.width()}).appendTo(this.element)
}},_bindEvents:function(){var a=this;
this.element.children("div.pui-galleria-nav-prev").on("click.puigalleria",function(){if(a.slideshowActive){a.stopSlideshow()
}if(!a.isAnimating()){a.prev()
}});
this.element.children("div.pui-galleria-nav-next").on("click.puigalleria",function(){if(a.slideshowActive){a.stopSlideshow()
}if(!a.isAnimating()){a.next()
}});
this.strip.children("li.pui-galleria-frame").on("click.puigalleria",function(){if(a.slideshowActive){a.stopSlideshow()
}a.select($(this).index(),false)
})
},startSlideshow:function(){var a=this;
this.interval=window.setInterval(function(){a.next()
},this.options.transitionInterval);
this.slideshowActive=true
},stopSlideshow:function(){window.clearInterval(this.interval);
this.slideshowActive=false
},isSlideshowActive:function(){return this.slideshowActive
},select:function(g,j){if(g!==this.options.activeIndex){if(this.options.showCaption){this._hideCaption()
}var a=this.panels.eq(this.options.activeIndex),c=this.frames.eq(this.options.activeIndex),b=this.panels.eq(g),e=this.frames.eq(g);
a.hide(this.options.effect,this.options.effectOptions,this.options.effectSpeed);
b.show(this.options.effect,this.options.effectOptions,this.options.effectSpeed);
c.removeClass("pui-galleria-frame-active").css("opacity","");
e.animate({opacity:1},this.options.effectSpeed,null,function(){$(this).addClass("pui-galleria-frame-active")
});
if(this.options.showCaption){this._showCaption(b)
}if(j===undefined||j===true){var h=e.position().left,k=this.options.frameWidth+parseInt(e.css("margin-right"),10),i=this.strip.position().left,d=h+i,f=d+this.options.frameWidth;
if(f>this.stripWrapper.width()){this.strip.animate({left:"-="+k},this.options.effectSpeed,"easeInOutCirc")
}else{if(d<0){this.strip.animate({left:"+="+k},this.options.effectSpeed,"easeInOutCirc")
}}}this.options.activeIndex=g
}},_hideCaption:function(){this.caption.slideUp(this.options.effectSpeed)
},_showCaption:function(a){var b=a.children("img");
this.caption.html("<h4>"+b.attr("title")+"</h4><p>"+b.attr("alt")+"</p>").slideDown(this.options.effectSpeed)
},prev:function(){if(this.options.activeIndex!==0){this.select(this.options.activeIndex-1)
}},next:function(){if(this.options.activeIndex!==(this.panels.length-1)){this.select(this.options.activeIndex+1)
}else{this.select(0,false);
this.strip.animate({left:0},this.options.effectSpeed,"easeInOutCirc")
}},isAnimating:function(){return this.strip.is(":animated")
}})
});