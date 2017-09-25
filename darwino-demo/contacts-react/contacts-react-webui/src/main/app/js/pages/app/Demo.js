/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

 import { UserService } from '@darwino/darwino';

 export function checkUser(page) {
    let svc = new UserService();
    let user = svc.getCurrentUser();
    if(user.isAnonymous() || user.getDn()=="demo") {
        page.getDialog().alert({message:"Man, you are a demo user so we cannot let you save the data. But contact us, darwino.com, to know more about the technology!"})
        return false;
    }
    return true;
 }