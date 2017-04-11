import {Component, OnInit, ViewChild} from '@angular/core';
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

    constructor(private noteService: NotesService) {
    }

    ngOnInit(): void {
        this.startAndStopTime();
        this.noteService.getMusicBox().subscribe((resp) => {
            let musics = resp._body;
            this.musics = musics ? JSON.parse(musics) : [];
        });
    }

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
                this.localTime.nativeElement.innerText = now.toLocaleString();
            }, 1000);
        }
    }

}
