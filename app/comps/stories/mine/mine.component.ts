/**
 * Created by Gemu on 2017/5/16.
 */
import {Component} from "@angular/core";
import {Router} from '@angular/router';
import {Title} from "@angular/platform-browser";
import {ModalBoxComponent} from "../../modalbox/modalbox.component";
import {FriendService} from "../../../service/friend.service";
import {Cookie} from "../../../tools/cookie";

@Component({
    templateUrl: 'app/comps/stories/mine/mine.html',
    styleUrls: ['app/assets/styles/common.css'],
    providers: [ModalBoxComponent, FriendService]
})
export class MineComponent {

    stories:any[] = []; // 我的故事列表
    storiesPage:any = {pageNo: 1, pageSize: 20}; // 我的故事列表分页信息
    modalBoxComp: ModalBoxComponent;

    username:string;
    passcode:string;

    loginFlag:boolean = false;

    constructor(title: Title, private friendService: FriendService, private router: Router) {
        title.setTitle("故事-个人中心");
        
        // 判断浏览器类型，区分移动端和PC端
        // this.browserInfo = navigator.appVersion;
        var style = document.createElement('link');
        style.rel = "stylesheet";
        let isAndroid = navigator.appVersion.match(/android/gi);
        let isIPhone = navigator.appVersion.match(/iphone/gi);
        let isIPad = navigator.appVersion.match(/iPad/gi);
        let isPc = !isAndroid && !isIPhone && !isIPad;
        if (!isPc) {
            style.href = 'app/comps/stories/mine/mine-mobile.css';
        } else {
            style.href = 'app/comps/stories/mine/mine.css';
        }
        document.head.appendChild(style);

        if (!Cookie.getCookie('OD') || Cookie.getCookie('OD') == 'undefined') {
            // 模态框
            ModalBoxComponent.showEvent.subscribe((modalBoxComp) => {
                if (modalBoxComp.identify != 'stories-login') return;
                this.modalBoxComp = modalBoxComp;
                this.modalBoxComp.openModal("通关文牒");
                this.modalBoxComp.confirmEvent.subscribe(() => {
                    if (!this.username) return;
                    this.friendService.login({username: this.username, passcode: this.passcode}).subscribe((resp) => {
                        if (resp.status == 200) {
                            let odAndFriend = resp._body;
                            if (odAndFriend) {
                                odAndFriend = JSON.parse(odAndFriend);
                                if (!odAndFriend['OD']) {
                                    return false;
                                }
                                Cookie.clearCookie('OD');
                                Cookie.clearCookie('friend');
                                Cookie.setCookie('OD', odAndFriend['OD'], 30);
                                Cookie.setCookie('friend', odAndFriend['friend']['userName'], 30);
                                this.loginFlag = false;
                                this.router.navigate(['stories', 'mine', 'add']);
                            }
                        }
                    });
                });
            });
            this.loginFlag = true;
        } else {
            this.loginFlag = false;
        }
    }

}