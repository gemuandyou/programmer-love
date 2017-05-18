/**
 * Created by Gemu on 2017/5/16.
 */
import {Component, OnInit, TemplateRef} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/stories/circle/circle.html',
    styleUrls: ['app/assets/styles/stories.css'],
    providers: [TemplateRef]
})
export class CircleComponent implements OnInit {

    stories:any[] = []; // 故事列表

    constructor(title:Title, private tmplRef:TemplateRef) {
        title.setTitle("我们的故事");
    }

    ngOnInit():void {
        this.getPage(1);
    }

    getPage(pageNo:number):void {
        let imgs = ['app/assets/images/default_avatar.jpg', 'app/assets/images/drawings.png'];
        for (let i = 0; i < 20; i++) {
            this.stories.push({
                img: imgs[Math.floor(Math.random() * 2)], section: '好奇心日报以商业视角观察生' +
                '活并启发你的好奇心,囊括商业报道、科技新闻、生活方式等各个领域,a致ss力成为这个时代最好的媒体,为用户提供最好的新闻资讯。' +
                '好奇心日报好奇心研究所 栏目中心 长文章 10 个图 Top 15 商业 智能 设计 时尚 娱乐 城市 游戏 全部分类 APP ' +
                '登录 退出关于我们 好奇心微信公众号...'
            });
        }
    }

}