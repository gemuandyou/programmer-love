/**
 * Created by Gemu on 2017/4/24.
 */
import {Component, OnDestroy} from "@angular/core";
import {Router} from '@angular/router';
import {Title} from "@angular/platform-browser";
import {AppComponent} from "../../app.component";

@Component({
    templateUrl: 'app/comps/stories/stories.html'
})
export class StoriesComponent implements OnDestroy {
    isPc: boolean = true;

    constructor(title: Title, private router: Router) {
        title.setTitle("故事会");
        if (router.url.endsWith('/stories')) {
            this.router.navigate(['stories', 'circle']);
        }
        
        // 判断浏览器类型，区分移动端和PC端
        // this.browserInfo = navigator.appVersion;
        var style = document.createElement('link');
        style.rel = "stylesheet";
        let isAndroid = navigator.appVersion.match(/android/gi);
        let isIPhone = navigator.appVersion.match(/iphone/gi);
        let isIPad = navigator.appVersion.match(/iPad/gi);
        this.isPc = !isAndroid && !isIPhone && !isIPad;
        if (!this.isPc) {
            style.href = 'app/assets/styles/stories-mobile.css';
        } else {
            style.href = 'app/assets/styles/stories.css';
        }
        document.head.appendChild(style);
    }

    ngOnDestroy(): void {
        AppComponent.viewDestroy.emit();
    }
}