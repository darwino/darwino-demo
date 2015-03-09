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

$(function(){$.widget("primeui.puiinputtext",{_create:function(){var a=this.element,b=a.prop("disabled");
a.addClass("pui-inputtext ui-widget ui-state-default ui-corner-all");
if(b){a.addClass("ui-state-disabled")
}else{a.hover(function(){a.toggleClass("ui-state-hover")
}).focus(function(){a.addClass("ui-state-focus")
}).blur(function(){a.removeClass("ui-state-focus")
})
}a.attr("role","textbox").attr("aria-disabled",b).attr("aria-readonly",a.prop("readonly")).attr("aria-multiline",a.is("textarea"))
},_destroy:function(){}})
});