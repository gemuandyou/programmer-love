/**
 * Created by Gemu on 2017/5/16.
 */
import {Component, OnInit, ViewEncapsulation, ViewChild, trigger, state, style, transition, animate, keyframes} from "@angular/core";
import {ActivatedRoute} from '@angular/router';
import {HashLocationStrategy,LocationStrategy} from '@angular/common';
import {Title} from "@angular/platform-browser";
import {StoriesService} from "../../../service/stories/stories.service";
import {Cookie} from "../../../tools/cookie";
import {Notify} from "../../../tools/notification";

@Component({
    templateUrl: 'app/comps/stories/detail/detail.html',
    providers: [StoriesService, {provide: LocationStrategy,useClass: HashLocationStrategy}],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('visibleAnimation', [
            state('hide', style({display: 'none'})),
            state('show', style({display: 'block'})),
            transition('hide => show',
               animate('300ms', keyframes([
                   style({display: 'none', transform: 'translateX(-100%)', offset: 0}),
                   style({display: 'block', transform: 'translateX(15px)',  offset: 0.3}),
                   style({display: 'block', transform: 'translateX(0)',     offset: 1.0})
               ]))
            ),
            transition('show => hide', 
                animate('300ms', style({display: 'none', offset: 0}))
            )
        ])
    ]
})
export class DetailComponent implements OnInit {

    isComment: boolean = false;
    yourself: boolean = false;
    story: any = {};
    comments: any[] = []; // 故事评论列表
    commentPage: any = { pageNo: 1, pageSize: 20 }; // 故事评论列表分页信息
    commentContent: string = '';
    notifyMsg: string = '';
    isPc: boolean = false;
    @ViewChild('body') bodyEle;
    @ViewChild('commentContentEle') commentContentEle;

    constructor(title: Title, private route: ActivatedRoute, private storiesService: StoriesService) {
        title.setTitle("故事详情");

        // 判断浏览器类型，区分移动端和PC端
        // this.browserInfo = navigator.appVersion;
        var style = document.createElement('link');
        style.rel = "stylesheet";
        let isAndroid = navigator.appVersion.match(/android/gi);
        let isIPhone = navigator.appVersion.match(/iphone/gi);
        let isIPad = navigator.appVersion.match(/iPad/gi);
        this.isPc = !isAndroid && !isIPhone && !isIPad;
        if (!this.isPc) {
            style.href = 'app/comps/stories/detail/detail-mobile.css';
        } else {
            style.href = 'app/comps/stories/detail/detail.css';
        }
        document.head.appendChild(style);
    }

    ngOnInit():void {
        this.route.params.subscribe(params => {
            let id = params['id'];
            this.storiesService.getStory(id).subscribe((resp) => {
                if (resp.status == 200) {
                    this.story = JSON.parse(resp._body);
                    this.bodyEle.nativeElement.innerHTML = this.story.paragraph;
                    this.yourself = this.story.author == Cookie.getCookie('friend');
                    
                    this.getComments();

                }
            });
        });
    }

    getComments(): void {
        let condi = { pageNo: this.commentPage.pageNo, filter: {storyId: this.story.id} };
        this.storiesService.storyCommentPage(condi).subscribe((resp) => {
            if (resp.status == 200) {
                let data = JSON.parse(resp._body);
                this.commentPage.pageNo = (data.entries && data.entries.length > 0) ? data.pageNo : data.pageNo - 1;
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
                this.comments = this.comments.concat(data.entries);
            } else {
                Notify.error('获取失败');
            }
        });
    }

    triggerComment(): void {
        this.isComment = true;
        let originalH = document.getElementsByClassName('stories-content')[0].scrollHeight;
        let handle = setInterval(() => {
            console.count();
            let currentH = document.getElementsByClassName('stories-content')[0].scrollHeight;
            if (currentH != originalH) {
                clearInterval(handle);
            }
            if (this.isPc) {
                document.getElementsByClassName('stories')[0].scrollTop = currentH;
            } else {
                document.body.scrollTop = currentH;
            }
        }, 100);
        setTimeout(() => {clearInterval(handle);}, 2000);
    }

    comment(): void {
        let content = this.commentContentEle.nativeElement.textContent;
        if (content) {
            let comment = {
                storyId: this.story.id, 
                friendName: Cookie.getCookie('friend'), 
                content: content,
                date: new Date().getTime()
            };
            this.storiesService.storyComment(comment).subscribe((resp) => {
                if (resp.status == 200) {
                    if (resp._body == 'true') {
                        this.comments.splice(0, 0, comment);
                        this.isComment = false;
                        Notify.success('评论成功');
                    } else {
                        Notify.error('获取失败');
                    }
                } else {
                    Notify.error('获取失败');
                }
            });
        } else {
            Notify.info('老铁，你倒是写评论内容啊');
        }
    }

}