/**
 * Created by Gemu on 2017/5/16.
 */
import {Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, trigger, state, style, transition, animate} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/stories/circle/circle.html',
    styleUrls: ['app/assets/styles/stories.css'],
    animations: [
        trigger('visibleAnimation', [
            state('show', style({opacity: 1})),
            state('hide', style({opacity: 0})),
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
export class CircleComponent implements OnInit {

    // 瀑布流相关
    visibleCircle:Array<boolean> = []; // 是否显示故事块，用户瀑布流排版
    columnsMaxHeight:number[] = [0, 0, 0]; // 瀑布流列高统计

    stories:any[] = []; // 故事列表
    storiesPage:any = {pageNo: 1, pageSize: 20}; // 故事列表分页信息
    beforeScroll: number = 0; // 获取故事列表分页操作时的滚动条位置
    @Output() static circleBlockRenderEv:EventEmitter<any> = new EventEmitter(); // 故事块渲染事件

    @ViewChild('circleContent') circleContent;

    constructor(title:Title, private elementRef:ElementRef) {
        title.setTitle("我们的故事");
    }

    ngOnInit():void {
        CircleComponent.circleBlockRenderEv.subscribe((index) => {
            let eles:NodeListOf<HTMLDivElement> = this.elementRef.nativeElement.querySelectorAll('.circle-block');
            let ele:HTMLDivElement = eles.item(index);
            let handle = setInterval(() => {
                if (ele.getElementsByTagName('section').length > 0) {
                    clearInterval(handle);
                    this.composePinterest(ele, index);
                }
            }, 300);
            setTimeout(() => {
                clearInterval(handle);
            }, 1000);
        });
        this.getPage();
        // 监听滚动事件，实现翻页
        let storiesEle = document.querySelector('.stories');
        storiesEle.addEventListener('mousewheel', (ev) => {
            if (storiesEle.scrollTop == this.beforeScroll)  return false;
            if (storiesEle.scrollTop + storiesEle.clientHeight >= storiesEle.scrollHeight) {
                this.beforeScroll = storiesEle.scrollTop;
                this.storiesPage.pageNo++;
                this.getPage();
            }
        });
    }

    getPage():void {
        console.count('加载故事情节中。。。 页码：');
        let imgs = ['app/assets/images/default_avatar.jpg', 'app/assets/images/drawings.png', ''];
        for (let i = this.storiesPage.pageSize * (this.storiesPage.pageNo - 1); i < this.storiesPage.pageSize * this.storiesPage.pageNo; i++) {
            this.stories.push({
                img: imgs[Math.floor(Math.random() * 3)], section: i + '好奇心日报以商业视角观察生' +
                '活并启发你的好奇心,囊括商业报道、科技新闻、生活方式等各个领域,a致ss力成为这个时代最好的媒体,为用户' +
                '提供最好启发你的好奇心,囊括商业报道、科技新闻、生活方式等各个领域,a致ss力成为这个时代最好的媒体,为' +
                '用户提供最好启发你的好奇心,囊括商业报道、科技新闻、生活方式等各个领域,a致ss力成为这个时代最好的媒体,为用户提供最好启' +
                '发你的好奇心,囊括商业报道、科技新闻、生活方式等各个领域,a致ss力成为这个时代最好的媒体,为用户提供最好' +
                '启发你的好奇心,囊括商业报道、科技新闻、生活方式等各个领域,a致ss力成为这个时代最好的媒体,为用户提供最' +
                '好启发你的好奇心,囊括商业报道、科技新闻、生活方式等各个领域,a致ss力成为这个时代最好的媒体,为用户提' +
                '供最好启发你的好奇心,囊括商业报道、科技新闻、生活方式等各个领域,a致ss力成为这个时代最好的媒体,为用户提供最好的新闻资讯。' +
                '好奇心日报好奇心研究所 栏目中心 长文章 10 个图 Top 15 商业 智能 设计 时尚 娱乐 城市 游戏 全部分类 APP ' +
                '登录 退出关于我们 好奇心微信公众号...', belongs: '戈木'
            });
            this.visibleCircle.push(false);
        }
    }

    /**
     * 按瀑布流排版插入故事块
     */
    composePinterest(ele: HTMLDivElement, index: number): void {
        let column = 1;
        if (this.columnsMaxHeight[1] <= this.columnsMaxHeight[0] && this.columnsMaxHeight[1] <= this.columnsMaxHeight[2]) {
            column = 2;
        }
        if (this.columnsMaxHeight[2] <= this.columnsMaxHeight[0] && this.columnsMaxHeight[2] <= this.columnsMaxHeight[1]) {
            column = 3;
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
        this.visibleCircle[index] = true;
    }
}