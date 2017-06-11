/**
 * Created by Gemu on 2017/5/16.
 */
import {Component, OnInit, AfterViewInit, Output, EventEmitter, ElementRef, ViewChild} from "@angular/core";
import {Title} from "@angular/platform-browser";
import { Notify } from "../../../../tools/notification";
import { StoriesService } from "../../../../service/stories/stories.service";
import {Cookie} from "../../../../tools/cookie";

@Component({
    templateUrl: 'app/comps/stories/mine/list/list.html',
    providers: [StoriesService]
})
export class MineListComponent implements OnInit {

    notifyMsg: string = '';

    isPc: boolean = true;
    isLoadFinished: boolean = true;

    stories: any[] = []; // 故事列表
    storiesPage: any = { pageNo: 1, pageSize: 20 }; // 故事列表分页信息
    beforeScroll: number = 0; // 获取故事列表分页操作时的滚动条位置
    @Output() static circleBlockRenderEv: EventEmitter<any> = new EventEmitter(); // 故事块渲染事件

    @ViewChild('circleContent') circleContent;

    constructor(title: Title, private elementRef: ElementRef, private storiesService: StoriesService) {
        title.setTitle("我们的故事");

        // 判断浏览器类型，区分移动端和PC端
        // this.browserInfo = navigator.appVersion;
        var style = document.createElement('link');
        style.rel = "stylesheet";
        let isAndroid = navigator.appVersion.match(/android/gi);
        let isIPhone = navigator.appVersion.match(/iphone/gi);
        let isIPad = navigator.appVersion.match(/iPad/gi);
        this.isPc = !isAndroid && !isIPhone && !isIPad;
        if (!this.isPc) {
            style.href = 'app/comps/stories/mine/list/list-mobile.css';
        } else {
            style.href = 'app/comps/stories/mine/list/list.css';
        }
        document.head.appendChild(style);

        if (this.isPc) {
            window.onresize = () => {
                this.stories = []; // 故事列表
                this.storiesPage = { pageNo: 1, pageSize: 20 }; // 故事列表分页信息
                this.beforeScroll = 0; // 获取故事列表分页操作时的滚动条位置
                this.getPage();
            };
        }
    }

    ngOnInit(): void {
        this.getPage();
    }

    getPage(): void {
        console.count('加载故事情节中。。。 页码：');
        let condi = { pageNo: this.storiesPage.pageNo };
        let OD = Cookie.getCookie('OD');
        let friendC = Cookie.getCookie('friend');
        if (!OD || !friendC || OD == 'undefined' || friendC == 'undefined') return;
        // if (friendC) {
        //     let friend = JSON.parse(friendC);
        //     condi['filter'] = { author:  friend['userName']};
        //     this.storiesService.storyPage(condi).subscribe((resp) => {
        //         if (resp.status == 200) {
        //             let data = JSON.parse(resp._body);
        //             this.storiesPage.pageNo = (data.entries && data.entries.length > 0) ? data.pageNo : data.pageNo - 1;
        //             if (!data.entries) {
        //                 data.entries = [];
        //             }
        //             if (data.entries.length == 0) {
        //                 this.notifyMsg = '没有更多了';
        //                 setTimeout(() => {
        //                     this.notifyMsg = '';
        //                 }, 3000);
        //                 Notify.info('没有更多了');
        //             }
        //             this.stories = this.stories.concat(data.entries);
        //             this.isLoadFinished = true;
        //         } else {
        //             Notify.error('获取失败');
        //         }
        //     });
        // }
    }

    getNextPage(): void {
        this.storiesPage.pageNo++;
        this.getPage();
    }

}