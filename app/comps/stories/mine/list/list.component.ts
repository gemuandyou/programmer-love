/**
 * Created by Gemu on 2017/5/16.
 */
import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/stories/mine/list/list.html'
})
export class MineListComponent implements OnInit {

    stories:any[] = []; // 我的故事列表
    storiesPage:any = {pageNo: 1, pageSize: 20}; // 我的故事列表分页信息

    constructor(title: Title) {
        title.setTitle("我的故事列表");

        // 判断浏览器类型，区分移动端和PC端
        // this.browserInfo = navigator.appVersion;
        var style = document.createElement('link');
        style.rel = "stylesheet";
        let isAndroid = navigator.appVersion.match(/android/gi);
        let isIPhone = navigator.appVersion.match(/iphone/gi);
        let isIPad = navigator.appVersion.match(/iPad/gi);
        let isPc = !isAndroid && !isIPhone && !isIPad;
        if (!isPc) {
            style.href = 'app/comps/stories/mine/list/list-mobile.css';
        } else {
            style.href = 'app/comps/stories/mine/list/list.css';
        }
        document.head.appendChild(style);
    }

    ngOnInit():void {
        this.getPage();
    }

    getPage():void {
        console.count('加载我的故事情节中。。。 页码：');
        let imgs = ['app/assets/images/default_avatar.jpg', 'app/assets/images/drawings.png'];
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
        }
    }

}