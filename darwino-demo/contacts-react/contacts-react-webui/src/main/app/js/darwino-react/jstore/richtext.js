/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2017.
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

import queryString from 'query-string';
import DEV_OPTIONS from '../util/dev';

/*
 * Rich text utilities
 */
export function richTextToDisplayFormat({databaseId, storeId, instanceId, unid}, html) {
    if(html) {
        var INLINE_IMAGE_STORAGE_PATTERN = /src="\$document-attachment\/([^"]+(\||%7C){2}[^"]+)"/g
        return html.replace(INLINE_IMAGE_STORAGE_PATTERN, 
                'src="'+DEV_OPTIONS.serverPrefix+'$darwino-jstore'
                +'/databases/' + encodeURIComponent(databaseId)
                + '/stores/' + encodeURIComponent(storeId) 
                + '/documents/' + encodeURIComponent(unid) + '/attachments/$1'
                +(instanceId ? '?instance=' + encodeURIComponent(instanceId) : '') 
                + '"');
    }
    return html
}

export function richTextToStorageFormat({databaseId, storeId, instanceId, unid}, html) {
    if(html) {
        var INLINE_IMAGE_DISPLAY_PATTERN = /src="'+DEV_OPTIONS.serverPrefix+'\$darwino-jstore\/databases\/([^\/]+)\/stores\/([^\/]+)\/documents\/([^\/]+)\/attachments\/([^\?]+)(\?instance=([^"]+))?"/g;
        return html.replace(INLINE_IMAGE_DISPLAY_PATTERN, 'src="$document-attachment/$4"');
    }
    return html
}

export function renderAttachmentUrl(databaseId, storeId, unid, name) {
    return    DEV_OPTIONS.serverPrefix+`$darwino-jstore/databases/${encodeURIComponent(databaseId)}`
            + `/stores/${encodeURIComponent(storeId)}/` 
            + `documents/${encodeURIComponent(unid)}/`
            + `attachments/${encodeURIComponent(name)}`;
}

export function cleanAttachmentName(name) {
    if(!name) { return "" }
    const inlineIndex = name.indexOf("||");
    if(inlineIndex > -1) {
        return name.substring(inlineIndex+2);
    }
    const attIndex = name.indexOf("^^");
    if(attIndex > -1) {
        return name.substring(attIndex+2);
    }
    return name;
}
