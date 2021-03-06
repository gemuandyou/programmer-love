/**
 * Created by gemu on 16/5/7.
 */
export namespace Notify {
    export var success = (msg: string) => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission(function(status){
                //if(Notification.permission !== status){
                //    Notification.permission = status;
                //}
                console.log(status);
            });
        } else {
            if (Notification.permission === 'granted') {
                // If it's okay let's create a notification
                var notification = new Notification('好消息', {body: msg, icon: 'app/assets/images/default_avatar.jpg'});
                setTimeout(()=>{
                    notification.close();
                }, 2000);
            }
        }
    };

    export var error = (msg: string) => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission(function(status){
                console.log(status);
            });
        } else {
            if (Notification.permission === 'granted') {
                // If it's okay let's create a notification
                var notification = new Notification('坏消息', {body: msg, icon: 'app/assets/icons/default_avatar.jpg'});
                setTimeout(()=>{
                    notification.close();
                }, 2000);
            }
        }
    };

    export var info = (msg: string) => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission(function(status){
                console.log(status);
            });
        } else {
            if (Notification.permission === 'granted') {
                // If it's okay let's create a notification
                var notification = new Notification('提示', {body: msg, icon: 'app/assets/icons/default_avatar.jpg'});
                setTimeout(()=>{
                    notification.close();
                }, 2000);
            }
        }
    };

    export var requestPermission = ()=> {
        if (Notification.permission !== 'granted')
            Notification.requestPermission();
    }
}
