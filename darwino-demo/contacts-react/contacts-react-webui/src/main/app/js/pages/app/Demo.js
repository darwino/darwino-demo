/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

 import { UserService } from '@darwino/darwino';

 export function checkUser(page) {
    if(isDemoUser()) {
        page.getDialog().alert({message:"Man, you are a demo user so we cannot let you save the data. You can contact us, www.darwino.com, to know more about the technology!"})
        return false;
    }
    return true;
 }

 export function isDemoUser() {
    let svc = new UserService();
    let user = svc.getCurrentUser();
    return user.isAnonymous() || user.getDn()=="demo";
 }