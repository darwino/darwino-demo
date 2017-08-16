/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

function RouteForm(entry) {
    let form = entry && entry.form;
    if(!form) return null;
    let id = entry ? entry.__meta.unid : "";
    switch(form) {
        case "Contact":     return "/app/contact/"+id;
        case "Company":     return "/app/company/"+id;
    }
    return null;
}
export default RouteForm;
