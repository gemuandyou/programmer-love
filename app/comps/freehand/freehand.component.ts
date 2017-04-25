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
    isErase: boolean = false; // 画笔是否是橡皮檫
    eraseSize = 20; // 橡皮擦图标长宽（px）
    marginLeft = 200; // 画布左间隔长度（px）

    @ViewChild('freehand') freehand;

    constructor(title: Title) {
        title.setTitle("鼠绘");
    }

    ngAfterViewInit() {
        // var script = document.createElement('script');
        // document.body.appendChild(script);
        // script.type = "text/javascript";
        // script.src = 'app/comps/freehand/freehand.js';

        var cvsDom = document.getElementsByTagName('canvas')[0];
        var cvsDiv = this.freehand.nativeElement;
        var starting = false;
        cvsDom.setAttribute('width', (cvsDiv.offsetWidth - this.marginLeft) + '');
        cvsDom.setAttribute('height', (cvsDiv.offsetHeight) + '');
        var ctx = cvsDom.getContext('2d');
        cvsDom.onmouseover = () => {
            if (this.isErase) {
                cvsDom.style.cursor = 'url("app/assets/images/erase.png"), default';
            } else {
                cvsDom.style.cursor = 'url("app/assets/images/drawings.png"), default';
            }
        };
        cvsDom.onmousedown = (e) => {
            var target = e.srcElement;
            var mX = e.pageX - target.clientLeft - this.marginLeft;
            var mY = e.pageY - target.clientTop;
            if (this.isErase) {
                ctx.clearRect(mX + 2, mY + 2, this.eraseSize, this.eraseSize);
            } else {
                ctx.beginPath(); // 开始起点
                ctx.moveTo(mX, mY); // 开始移动
                ctx.lineWidth = 1;
            }
            starting = true;
        };
        cvsDom.onmousemove = (e) => {
            if (starting) {
                var target = e.srcElement;
                var lX = e.pageX - target.clientLeft - this.marginLeft;
                var lY = e.pageY - target.clientTop;
                if (this.isErase) {
                    ctx.clearRect(lX + 2, lY + 2, this.eraseSize, this.eraseSize);
                } else {
                    ctx.lineTo(lX, lY); // 移动
                    ctx.strokeStyle = '#ECECEC';
                    ctx.stroke(); // 画线
                }
            }
        };
        cvsDom.onmouseup = () => {
            ctx.closePath(); // 结束点
            starting = false;
        };
        cvsDom.onmouseout = () => {
            ctx.closePath(); // 结束点
            starting = false;
        };

    }

    loadImg(e): void {
        let currEle = e.target;
        var cvsDom = document.getElementsByTagName('canvas')[0];
        var ctx = cvsDom.getContext('2d');
        ctx.clearRect(0, 0, cvsDom.offsetWidth, cvsDom.offsetHeight);
        ctx.drawImage(currEle, 0, 0, cvsDom.offsetWidth, cvsDom.offsetHeight);
    }

    saveImg(): void {
        var cvsDom = document.getElementsByTagName('canvas')[0];
        var imgBase64 = cvsDom.toDataURL('image/png');
        this.imgsPreview.push(imgBase64);
    }

    clearCanvas(): void {
        var cvsDom = document.getElementsByTagName('canvas')[0];
        var ctx = cvsDom.getContext('2d');
        ctx.clearRect(0, 0, cvsDom.offsetWidth, cvsDom.offsetHeight);
    }

    eraserCanvas(): void {
        this.isErase = !this.isErase;
    }

}