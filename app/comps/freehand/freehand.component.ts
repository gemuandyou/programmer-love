/**
 * Created by Gemu on 2017/4/25.
 */
import {Component, AfterViewInit, ViewChild} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/freehand/freehand.html',
    styleUrls: ['app/assets/styles/common.css', 'app/assets/styles/freehand.css']
})
export class FreehandComponent implements AfterViewInit {

    imgsPreview: string[] = []; // 图片预览

    constructor(title: Title) {
        title.setTitle("鼠绘");
    }

    ngAfterViewInit() {
        var script = document.createElement('script');
        document.body.appendChild(script);
        script.type = "text/javascript";
        script.src = 'app/comps/freehand/freehand.js';
    }

    loadImg(e): void {
        let currEle = e.target;
        var cvsDom = document.getElementsByTagName('canvas')[0];
        var ctx = cvsDom.getContext("2d");
        ctx.clearRect(0, 0, cvsDom.offsetWidth, cvsDom.offsetHeight);
        ctx.drawImage(currEle, 0, 0, cvsDom.offsetWidth, cvsDom.offsetHeight);
    }

    saveImg(): void {
        var cvsDom = document.getElementsByTagName('canvas')[0];
        var imgBase64 = cvsDom.toDataURL('image/png');
        this.imgsPreview.push(imgBase64);
    }

}