/* 
 * (c) Copyright Darwino Inc. 2014-2017.
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
        var INLINE_IMAGE_DISPLAY_PATTERN = /src="[^\"]*\$darwino-jstore\/databases\/([^\/]+)\/stores\/([^\/]+)\/documents\/([^\/]+)\/attachments\/([^\?]+)(\?instance=([^"]+))?"/g;
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
