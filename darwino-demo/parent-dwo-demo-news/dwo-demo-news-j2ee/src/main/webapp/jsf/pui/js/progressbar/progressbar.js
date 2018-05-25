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

$(function(){$.widget("primeui.puiprogressbar",{options:{value:0,labelTemplate:"{value}%",complete:null,easing:"easeInOutCirc",effectSpeed:"normal",showLabel:true},_create:function(){this.element.addClass("pui-progressbar ui-widget ui-widget-content ui-corner-all").append('<div class="pui-progressbar-value ui-widget-header ui-corner-all"></div>').append('<div class="pui-progressbar-label"></div>');
this.jqValue=this.element.children(".pui-progressbar-value");
this.jqLabel=this.element.children(".pui-progressbar-label");
if(this.options.value!==0){this._setValue(this.options.value,false)
}this.enableARIA()
},_setValue:function(d,b){var c=(b===undefined||b)?true:false;
if(d>=0&&d<=100){if(d===0){this.jqValue.hide().css("width","0%").removeClass("ui-corner-right");
this.jqLabel.hide()
}else{if(c){this.jqValue.show().animate({width:d+"%"},this.options.effectSpeed,this.options.easing)
}else{this.jqValue.show().css("width",d+"%")
}if(this.options.labelTemplate&&this.options.showLabel){var a=this.options.labelTemplate.replace(/{value}/gi,d);
this.jqLabel.html(a).show()
}if(d===100){this._trigger("complete")
}}this.options.value=d;
this.element.attr("aria-valuenow",d)
}},_getValue:function(){return this.options.value
},enableARIA:function(){this.element.attr("role","progressbar").attr("aria-valuemin",0).attr("aria-valuenow",this.options.value).attr("aria-valuemax",100)
},_setOption:function(a,b){if(a==="value"){this._setValue(b)
}$.Widget.prototype._setOption.apply(this,arguments)
},_destroy:function(){}})
});