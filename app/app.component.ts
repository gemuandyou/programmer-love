import {Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {NotesService} from "./service/notes/notes.service";
@Component({
    selector: 'my-app',
    templateUrl: 'app/app.html',
    styleUrls: ['app/assets/styles/app.css', 'app/assets/styles/common.css'],
    providers: [NotesService]
})
export class AppComponent implements OnInit {

    musics: Array<any> = [];
    @ViewChild('localTime') localTime;
    timeHandle;
    whiteList: string[] = ["/charity", "/notes", "/essay", "/medicine", "/freehand"];
    showMenu: boolean = false;
    isFull: boolean = false;

    @Output() static viewDestroy: EventEmitter<any> = new EventEmitter(); // 视图销毁事件

    constructor(private noteService: NotesService, private location: Location, private route: ActivatedRoute) {
        this.showMenu = false;
        for (let white of this.whiteList) {
            if (location.path().startsWith(white)) {
                this.showMenu = true;
            }
        }
        AppComponent.viewDestroy.subscribe(() => {
            this.showMenu = false;
            for (let white of this.whiteList) {
                if (location.path().startsWith(white)) {
                    this.showMenu = true;
                }
            }
        });
    }

    ngOnInit(): void {
        this.startAndStopTime();
        this.noteService.getMusicBox().subscribe((resp) => {
            let musics = resp._body;
            this.musics = musics ? JSON.parse(musics) : [];
        });
    }

    /**音乐播放相关操作*/

    playMusic(ev, index) {
        let audios = document.getElementsByClassName('music');
        let target = ev.currentTarget;
        if (target.className === 'playing') {
            audios[index].pause();
            audios[index].currentTime = audios[index].seekable.start(0);
            target.removeAttribute('class');
            return;
        }
        let lis = target.parentNode.children;
        for (let i = 0; i < lis.length; i++) {
            let li = lis[i];
            audios[i].pause();
            audios[i].currentTime = audios[i].seekable.start(0);
            li.removeAttribute('class');
        }
        target.setAttribute('class', 'playing');
        audios[index].play();
        console.log(audios[index]);
    }

    startAndStopTime() {
        if (this.timeHandle) {
            clearInterval(this.timeHandle);
            this.timeHandle = null;
        } else {
            this.timeHandle = setInterval(() => {
                let now = new Date();
                if (this.localTime)
                    this.localTime.nativeElement.innerText = now.toLocaleString();
            }, 1000);
        }
    }

    /**浏览器全屏相关*/

    triggerFullScreen(): void {
        if (this.isFull) {
            this.unfullScreen();
        } else {
            this.fullScreen();
        }
    }

    /**
     * 全屏（F11）
     */
    fullScreen(): void {
        // 判断各种浏览器，找到正确的方法
        let ele = document.getElementsByClassName('menu')[0];
        var requestMethod = ele.requestFullScreen ||
        ele.webkitRequestFullScreen ||    //Webkit内核（如：谷歌）
        ele.mozRequestFullScreen || //Mozilla内核（如：火狐）
        ele.msRequestFullScreen; //IE内核
        if (requestMethod) {
            requestMethod.call(ele);
        }
        else if (typeof window.ActiveXObject !== "undefined") {// 其他
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
        this.isFull = true;
    }

    /**
     * 取消全屏
     */
    unfullScreen(): void {
        // 判断各种浏览器，找到正确的方法
        var exitMethod = document.exitFullscreen ||
        document.mozCancelFullScreen ||    //Webkit内核（如：谷歌）
        document.webkitExitFullscreen || //Mozilla内核（如：火狐）
        document.webkitExitFullscreen; //IE内核
        if (exitMethod) {
            exitMethod.call(document);
        }
        else if (typeof window.ActiveXObject !== "undefined") {// 其他
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
        this.isFull = false;
    }

}
