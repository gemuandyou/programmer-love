/**
 * Created by Gemu on 2017/4/25.
 */
import {Component, AfterViewInit, ViewChild, OnDestroy} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {AppComponent} from "../../app.component";
@Component({
    templateUrl: 'app/comps/freehand/freehand.html',
    styleUrls: ['app/assets/styles/common.css', 'app/assets/styles/freehand.css']
})
export class FreehandComponent implements AfterViewInit, OnDestroy {

    imgsPreview: string[] = []; // 图片预览
    isErase: boolean = false; // 画笔是否是橡皮檫
    eraseSize = 20; // 橡皮擦图标长宽（px）
    marginLeft = 200; // PC端画布左间隔长度（px）
    marginTop = 132; // 移动端画布上间隔长度（px）
    isPc: boolean = true;

    @ViewChild('freehand') freehand;
    @ViewChild('freehandPreview') freehandPreview;

    constructor(title: Title) {
        title.setTitle("鼠绘");

        // 判断浏览器类型，区分移动端和PC端
        // this.browserInfo = navigator.appVersion;
        var style = document.createElement('link');
        style.rel = "stylesheet";
        let isAndroid = navigator.appVersion.match(/android/gi);
        let isIPhone = navigator.appVersion.match(/iphone/gi);
        let isIPad = navigator.appVersion.match(/iPad/gi);
        this.isPc = !isAndroid && !isIPhone && !isIPad;
        if (!this.isPc) {
            style.href = 'app/assets/styles/freehand-mobile.css';
        } else {
            style.href = 'app/assets/styles/freehand-pc.css';
        }
        document.head.appendChild(style);
    }

    ngOnDestroy(): void {
        AppComponent.viewDestroy.emit();
    }

    ngAfterViewInit() {

        // var script = document.createElement('script');
        // document.body.appendChild(script);
        // script.type = "text/javascript";
        // script.src = 'app/comps/freehand/freehand.js';

        // 初始化事件
        var cvsDom = document.getElementsByTagName('canvas')[0];
        var cvsDiv = this.freehand.nativeElement;
        var starting = false;
        if (this.isPc) {
            cvsDom.setAttribute('width', (cvsDiv.offsetWidth - this.marginLeft) + '');
            cvsDom.setAttribute('height', (cvsDiv.offsetHeight) + '');
        } else {
            cvsDom.setAttribute('width', (cvsDiv.offsetWidth) + '');
            cvsDom.setAttribute('height', (cvsDiv.offsetHeight - this.marginTop) + '');
        }
        var ctx = cvsDom.getContext('2d');
        // PC端
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

        // 移动端
        cvsDom.addEventListener('touchstart', (e) => {
            var touch = e.touches.item(0);
            var mX = touch.pageX;
            var mY = touch.pageY - this.marginTop;
            if (this.isErase) {
                ctx.clearRect(mX + 2, mY + 2, this.eraseSize, this.eraseSize);
            } else {
                ctx.beginPath(); // 开始起点
                ctx.moveTo(mX, mY); // 开始移动
                ctx.lineWidth = 1;
            }
            console.log(mX, mY)
            starting = true;
        });
        cvsDom.addEventListener('touchmove', (e) => {
            if (starting) {
                var touch = e.touches.item(0);
                var lX = touch.pageX;
                var lY = touch.pageY - this.marginTop;
                if (this.isErase) {
                    ctx.clearRect(lX + 2, lY + 2, this.eraseSize, this.eraseSize);
                } else {
                    ctx.lineTo(lX, lY); // 移动
                    ctx.strokeStyle = '#ECECEC';
                    ctx.stroke(); // 画线
                }
            }
            // 取消移动端浏览器的“橡皮筋效果”
            e.stopPropagation();
            e.preventDefault();
        });
        cvsDom.addEventListener('touchend', (e) => {
            ctx.closePath(); // 结束点
            starting = false;
        });
        cvsDom.addEventListener('touchcancel', (e) => {
            ctx.closePath(); // 结束点
            starting = false;
        });

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