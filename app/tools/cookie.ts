/**
 * Cookie相关操作
 * Created by Gemu on 2017/6/11.
 */
export class Cookie {

    //设置cookie
    static setCookie(cname, cvalue, exdays): void {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    //获取cookie
    static getCookie(cname): string {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i=0; i<ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    }
    //清除cookie  
    static clearCookie(name): void {
        this.setCookie(name, "", -1);
    }

}
