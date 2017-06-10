/**
 * Created by Gemu on 2017/5/16.
 */
import { Component, OnInit, AfterViewInit, Output, EventEmitter, ElementRef, ViewChild, trigger, state, style, transition, animate } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { StoriesService } from "../../../service/stories/stories.service";
import { Notify } from "../../../tools/notification";
@Component({
    templateUrl: 'app/comps/stories/circle/circle.html',
    providers: [StoriesService],
    animations: [
        trigger('visibleAnimation', [
            state('show', style({ opacity: 1 })),
            state('hide', style({ opacity: 0 })),
            //transition('show => hide',
            //    animate(300, keyframes([
            //        style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
            //        style({opacity: 1, transform: 'translateX(15px)',  offset: 0.3}),
            //        style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
            //    ]))
            //),
            transition('hide => show', animate('300ms')),
            transition('show => hide', animate('300ms'))
        ])
    ]
})
export class CircleComponent implements OnInit, AfterViewInit {

    notifyMsg: string = '';

    filterCtx: string = '';
    isPc: boolean = true;
    isLoadFinished: boolean = true;

    // 瀑布流相关
    visibleCircle: Array<boolean> = new Array(); // 是否显示故事块，用户瀑布流排版
    columnsMaxHeight: number[] = [0, 0, 0]; // 瀑布流列高统计

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
            style.href = 'app/comps/stories/circle/circle-mobile.css';
        } else {
            style.href = 'app/comps/stories/circle/circle.css';
        }
        document.head.appendChild(style);

        if (this.isPc) {
            window.onresize = () => {
                this.visibleCircle = new Array(); // 是否显示故事块，用户瀑布流排版
                this.columnsMaxHeight = [0, 0, 0]; // 瀑布流列高统计
                this.stories = []; // 故事列表
                this.storiesPage = { pageNo: 1, pageSize: 20 }; // 故事列表分页信息
                this.beforeScroll = 0; // 获取故事列表分页操作时的滚动条位置
                this.getPage();
            };
        }
    }

    ngOnInit(): void {
        CircleComponent.circleBlockRenderEv.subscribe((index) => {
            let eles: NodeListOf<HTMLDivElement> = this.elementRef.nativeElement.querySelectorAll('.circle-block');
            let ele: HTMLDivElement = eles.item(index);
            let handle = setInterval(() => {
                if (ele && ele.getElementsByTagName('section').length > 0) {
                    clearInterval(handle);
                    this.composePinterest(ele, index);
                }
            }, 300);
            setTimeout(() => {
                clearInterval(handle);
            }, 1000);
        });

        this.getPage();
    }

    ngAfterViewInit():void {
        // 监听滚动事件，实现翻页
        if (this.isPc) {
            let storiesEle = document.querySelector('.stories');
            storiesEle.addEventListener('mousewheel', (ev) => {
                if (this.isLoadFinished) {
                    if (storiesEle.scrollTop == this.beforeScroll) return false;
                    if (storiesEle.scrollTop + storiesEle.clientHeight >= storiesEle.scrollHeight) {
                        this.isLoadFinished = false;
                        this.beforeScroll = storiesEle.scrollTop;
                        this.storiesPage.pageNo++;
                        this.getPage();
                    }
                }
            });
        }
    }

    getPage(): void {
        console.count('加载故事情节中。。。 页码：');
        let condi = { pageNo: this.storiesPage.pageNo };
        if (this.filterCtx) {
            condi['filter'] = { author: this.filterCtx };
        }
        this.storiesService.storyPage(condi).subscribe((resp) => {
            if (resp.status == 200) {
                let data = JSON.parse(resp._body);
                this.storiesPage.pageNo = (data.entries && data.entries.length > 0) ? data.pageNo : data.pageNo - 1;
                if (!data.entries) {
                    data.entries = [];
                }
                if (data.entries.length == 0) {
                    this.notifyMsg = '没有更多了';
                    setTimeout(() => {
                        this.notifyMsg = '';
                    }, 3000);
                    Notify.info('没有更多了');
                }
                this.stories = this.stories.concat(data.entries);
                for (let i = 0; i < this.stories.length; i++) {
                    this.visibleCircle.push(false);
                }
                this.isLoadFinished = true;
            } else {
                Notify.error('获取失败');
            }
        });
    }

    getNextPage(): void {
        this.storiesPage.pageNo++;
        this.getPage();
    }

    change(event): void {
        if (event.key === 'Enter') {
            this.stories = [];
            this.visibleCircle = [];
            this.storiesPage = { pageNo: 1, pageSize: 20 };
            this.columnsMaxHeight = [0, 0, 0];
            this.getPage();
        }
    }

    /**
     * 按瀑布流排版插入故事块
     */
    composePinterest(ele: HTMLDivElement, index: number): void {
        if (this.isPc) {
            let column = 1;
            if (this.columnsMaxHeight[1] <= this.columnsMaxHeight[0] && this.columnsMaxHeight[1] <= this.columnsMaxHeight[2]) {
                if (this.columnsMaxHeight[1] <= this.columnsMaxHeight[2] && this.columnsMaxHeight[0] == this.columnsMaxHeight[1]) {
                    column = 1;
                } else {
                    column = 2;
                }
            }
            if (this.columnsMaxHeight[2] <= this.columnsMaxHeight[0] && this.columnsMaxHeight[2] <= this.columnsMaxHeight[1]) {
                if (this.columnsMaxHeight[0] == this.columnsMaxHeight[2]) {
                    column = 1;
                } else if (this.columnsMaxHeight[1] == this.columnsMaxHeight[2]) {
                    column = 2;
                } else {
                    column = 3;
                }
            }
            switch (column) {
                case 1: // 瀑布流第一列
                    ele.style.top = this.columnsMaxHeight[0] + 16 + 'px';
                    ele.style.left = 'calc(15% - 3rem)';
                    this.columnsMaxHeight[0] += ele.clientHeight + 16;
                    break;
                case 2: // 瀑布流第二列
                    ele.style.top = this.columnsMaxHeight[1] + 16 + 'px';
                    ele.style.left = 'calc(15% - 2rem + ' + ele.clientWidth + 'px)';
                    this.columnsMaxHeight[1] += ele.clientHeight + 16;
                    break;
                case 3: // 瀑布流第三列
                    ele.style.top = this.columnsMaxHeight[2] + 16 + 'px';
                    ele.style.left = 'calc(15% - 1rem + ' + ele.clientWidth * 2 + 'px)';
                    this.columnsMaxHeight[2] += ele.clientHeight + 16;
                    break;
            }
        }
        this.visibleCircle[index] = true;
    }
}