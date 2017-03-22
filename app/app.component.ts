import {Component} from '@angular/core';
@Component({
    selector: 'my-app',
    templateUrl: 'app/app.html',
    styleUrls: ['app/assets/styles/app.css', 'app/assets/styles/common.css']
})
export class AppComponent {

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

}
