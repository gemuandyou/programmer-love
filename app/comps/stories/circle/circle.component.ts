/**
 * Created by Gemu on 2017/5/16.
 */
import {Component, OnInit, Output, EventEmitter, ElementRef, trigger, state, style, transition, animate} from "@angular/core";
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
    visibleCircle: [] = []; // 是否显示故事块，用户瀑布流排版
    columnsMaxHeight: number[] = [0, 0, 0]; // 瀑布流列高统计

    stories:any[] = []; // 故事列表
    @Output() static circleBlockRenderEv: EventEmitter<any> = new EventEmitter(); // 故事块渲染事件

    constructor(title:Title, private elementRef: ElementRef) {
        title.setTitle("我们的故事");
    }

    ngOnInit():void {
        CircleComponent.circleBlockRenderEv.subscribe((index) => {
            let eles: NodeListOf<Element> = this.elementRef.nativeElement.querySelectorAll('.circle-block');
            let ele: Element = eles.item(index);
            let handle = setInterval(() => {
                if (ele.getElementsByTagName('img').length > 0) {
                    clearInterval(handle);
                    let column = 1;
                    if (this.columnsMaxHeight[1] <= this.columnsMaxHeight[0] && this.columnsMaxHeight[1] <= this.columnsMaxHeight[2]) {
                        column = 2;
                    }
                    if (this.columnsMaxHeight[2] <= this.columnsMaxHeight[0] && this.columnsMaxHeight[2] <= this.columnsMaxHeight[1]) {
                        column = 3;
                    }
                    switch (column) {
                        case 1: // 瀑布流第一列
                            ele.style.top = this.columnsMaxHeight[0] + 16;
                            ele.style.left = 'calc(15% - 3rem)';
                            this.columnsMaxHeight[0] += ele.clientHeight + 16;
                            break;
                        case 2: // 瀑布流第二列
                            ele.style.top = this.columnsMaxHeight[1] + 16;
                            ele.style.left = 'calc(15% - 2rem + ' + ele.clientWidth + 'px)';
                            this.columnsMaxHeight[1] += ele.clientHeight + 16;
                            break;
                        case 3: // 瀑布流第三列
                            ele.style.top = this.columnsMaxHeight[2] + 16;
                            ele.style.left = 'calc(15% - 1rem + ' + ele.clientWidth * 2 + 'px)';
                            this.columnsMaxHeight[2] += ele.clientHeight + 16;
                            break;
                    }
                    this.visibleCircle[index] = true;
                }
            }, 100);
            setTimeout(() => {
                clearInterval(handle);
            }, 100);
        });
        this.getPage(1);
    }

    getPage(pageNo:number):void {
        let imgs = ['app/assets/images/default_avatar.jpg', 'app/assets/images/drawings.png'];
        for (let i = 0; i < 20; i++) {
            this.stories.push({
                img: imgs[Math.floor(Math.random() * 2)], section: i + '好奇心日报以商业视角观察生' +
                '活并启发你的好奇心,囊括商业报道、科技新闻、生活方式等各个领域,a致ss力成为这个时代最好的媒体,为用户提供最好的新闻资讯。' +
                '好奇心日报好奇心研究所 栏目中心 长文章 10 个图 Top 15 商业 智能 设计 时尚 娱乐 城市 游戏 全部分类 APP ' +
                '登录 退出关于我们 好奇心微信公众号...'
            });
        }
        this.visibleCircle = new Array(this.stories.length);
    }

}